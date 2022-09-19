import { Knex } from "knex"
import { ReservationModel } from "../../dbModels/reservations"
import { Reservation } from "../../entities/reservations"
import { User } from "../../entities/users"
import { IReservationGuard } from "../../guards/Reservation.guard"
import { IPermissionChecker } from "../../infrastructure/PermissionChecker.infra"
import { IReservationInfrastructure } from "../../infrastructure/Reservation.infra"
import { SessionInfrastructure } from "../../infrastructure/Session.infra"
import { IUserInfrastructure } from "../../infrastructure/User.infra"
import { InnerErrorInterface, isInnerErrorInterface } from "../../interfaces/errors"
import { ReservationBaseInterface, ReservationBaseWithoutConfirmationInterface, ReservationCreateInterface, ReservationDatabaseInterface, ReservationInterface, ReservationWithoutSlotsInterface } from "../../interfaces/reservations"
import { ReservationsSlotsBaseInterface, SlotInterface } from "../../interfaces/slots"
import { UserRequestOption } from "../../interfaces/users"
import { IReservationRepo } from "../../repositories/Reservation.repo"
import { IUserRepo } from "../../repositories/User.repo"
import { CodeGenerator } from "../../utils/code"
import { IEmailSender } from "../../utils/email"
import { RoleService } from "../roles"
import { SessionCRUDService } from "../sessions/SessionCRUD.service"

export interface IReservationCRUDService {
    getSingleFullInfo(idUser: number, idRole: number, idReservation: number): 
    Promise<InnerErrorInterface | ReservationInterface>

    createReservation(user: UserRequestOption, requestBody: ReservationCreateInterface): 
    Promise<InnerErrorInterface | {
        id: number;
        id_session: number;
        need_confirmation: boolean;
    }>

    getReservations(user: UserRequestOption): Promise<InnerErrorInterface | ReservationInterface[]>

    deleteReservation(user: UserRequestOption, idReservation: number): 
    Promise<number | InnerErrorInterface>
}


export class ReservationCRUDService implements IReservationCRUDService {
    protected connection
    protected reservationModel
    protected roleService
    protected sessionCRUDService
    protected sessionInfrastructure
    protected userInfrastructure
    protected reservationInfrastructure
    protected reservationGuard
    protected emailSender
    protected codeGenerator
    protected userRepo
    protected permissionChecker
    protected reservationRepo

    constructor(
            connectionInstance: Knex<any, unknown[]>,
            reservationDatabaseInstance: ReservationModel,
            roleServiceInstance: RoleService,
            sessionCRUDServiceInstance: SessionCRUDService,
            sessionInfrastructure: SessionInfrastructure,
            userInfrastructureInstance: IUserInfrastructure,
            reservationInfrastructureInstance: IReservationInfrastructure,
            reservationGuardInstance: IReservationGuard,
            emailSenderInstance: IEmailSender,
            codeGeneratorInstance: CodeGenerator,
            userRepoInstance: IUserRepo,
            permissionCheckerInstance: IPermissionChecker,
            reservationRepoInstance: IReservationRepo 
    ) {
        this.connection = connectionInstance
        this.reservationModel = reservationDatabaseInstance
        this.roleService = roleServiceInstance
        this.sessionCRUDService = sessionCRUDServiceInstance
        this.sessionInfrastructure = sessionInfrastructure
        this.userInfrastructure = userInfrastructureInstance
        this.reservationInfrastructure = reservationInfrastructureInstance
        this.reservationGuard = reservationGuardInstance
        this.emailSender = emailSenderInstance
        this.codeGenerator = codeGeneratorInstance
        this.userRepo = userRepoInstance
        this.permissionChecker = permissionCheckerInstance
        this.reservationRepo = reservationRepoInstance
    }

    /**
     * * Получение брони (уровень "Посетитель", "Кассир", "Администратор")
     */
    async getSingleFullInfo(idUser: number, idRole: number, idReservation: number) {
        // Проверка-получение роли
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUser(idUser)
            .catch(e => { throw e })
            
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!userDB) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Пользователь не найден!'
            }
        }
        
        // Проверка наличия записи в базе данных
        const reservation = await this.reservationRepo.getReservation(idReservation)
        if (!reservation) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Бронь не найдена!'
            }
        }

        // Проверка на возможность доступа к брони и "ложный" 404-ответ 
        //(подразумевается 403)
        if (!(await this.permissionChecker.check_CanSeeAllReservations(userDB))) {
            if (reservation.idUser !== idUser) {
                return <InnerErrorInterface>{
                    code: 404,
                    message: 'Бронь не найдена!'
                }
            }
        }
        

        const result = await this.reservationInfrastructure.fetchReservations(
                userDB,
                [reservation])

        if (isInnerErrorInterface(result)) {
            return result
        }

        return result[0]
    }

    /**
     * * Создание брони
     */
    async createReservation(user: UserRequestOption, requestBody: ReservationCreateInterface) {
        // Получение роли из БД
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUser(user.id)
            .catch(e => { throw e })
            
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!userDB) {
            console.log(userDB)
            return <InnerErrorInterface> {
                code: 403,
                message: 'Пользователь не найден!'
            }
        }
        // Проверка может ли пользователь создавать брони
        if(!(await this.permissionChecker.check_CanReserve(userDB))) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Вам запрещено бронировать места!'
            }
        }
        // Проверка наличия сеанса
        const sessionQuery = await this.sessionCRUDService
            .getSingleUnlockedSession(requestBody.id_session)

        if (isInnerErrorInterface(sessionQuery)) {
            return sessionQuery
        }
        // Проверка на доступность сеанcа
        if (sessionQuery.is_locked === true) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Бронь на сеанс закрыта!'
            }
        }
        // Проверка на минимум слотов
        if (requestBody.slots.length === 0 ) {
            return <InnerErrorInterface>{
                code: 400,
                message: 'Вы не выбрали места для бронирования!'
            }
        }
        // Проверка на максимум слотов
        if (!(await this.permissionChecker.check_CanIgnoreMaxSlotsValue(userDB))  
                && requestBody.slots.length > sessionQuery.max_slots) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Превышено максимальное количество мест для брони!'
            }
        }
        // Проверка прав на больше чем одну бронь на сеанс
        if (!(await this.permissionChecker.check_CanHaveMoreThanOneReservationOnSession(userDB))) {
            // Проверка на наличие брони на сеанс у пользователя
            const checkVisitorReservation = await this.reservationInfrastructure
                .checkUserHasReservedSession(user.id, requestBody.id_session)

            if (checkVisitorReservation) {
                return <InnerErrorInterface> {
                    code: 403,
                    message: "Пользователь уже имеет брони на данный сеанс!"
                }
            }
        }
        // Проверка на коллизию выбранных слотов и уже забронированных мест
        const reservedSlotsQuery = await this.sessionInfrastructure
            .getReservedSlots(sessionQuery.id, sessionQuery.id_price_policy)

        if (isInnerErrorInterface(reservedSlotsQuery)) {
            return reservedSlotsQuery
        }

        const reservedSlots: SlotInterface[] = [...reservedSlotsQuery]
        
        let slotCheck: SlotInterface[] = []
        for (let aSlot of reservedSlots) {
            for (let bSlot of requestBody.slots) {
                if (aSlot.id === bSlot.id) {
                    slotCheck.push(aSlot)
                    break
                }
            }
            if(slotCheck.length > 0) {
                return <InnerErrorInterface> {
                    code: 409,
                    message: 'Одно из мест на сеанс уже забронировано. Пожалуйста, обновите страницу.'
                }
            }
        }

        // Транзакция: создание брони и забронированных мест
        const trx = await this.connection.transaction()

        let reservation: ReservationDatabaseInterface

        let reservationPayload: ReservationBaseInterface | ReservationBaseWithoutConfirmationInterface
        if (!(await this.permissionChecker.check_CanReserveWithoutConfirmation(userDB))) {
            reservationPayload = {
                id_user: user.id,
                id_session: sessionQuery.id,
                confirmation_code: this.codeGenerator.generateCode()
            }
        }
        else {
            reservationPayload = {
                id_user: user.id,
                id_session: sessionQuery.id,
                confirmation_code: this.codeGenerator.generateCode(),
                is_confirmed: true
            }
        }

        try {
            reservation = (await this.reservationModel
                .insert(trx, reservationPayload))[0]
        } catch(e) {
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        

        let slots: ReservationsSlotsBaseInterface[] = []
        for (let slot of requestBody.slots) {
            const item: ReservationsSlotsBaseInterface = {
                id_slot: slot.id,
                id_reservation: reservation.id
            }
            slots.push(item)
        }
        try {
            await this.reservationModel.insertReservationsSlotsList(trx, slots)
        } catch (e) {
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера в резервировании мест на бронь!'
            }
        }

        // Создание записи действия для оператора
        if ((await this.permissionChecker.check_CanSeeAllReservations(userDB))) {
            const actionDescription = `Подтверждение брони Res:${reservation.id}`
            try {
                await this.userRepo.createUserAction(userDB.id, actionDescription)
                .catch(e => { throw e }) 
            } catch(e) {
                console.log(e)
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера!'
                }
            }
            
        }

        await trx.commit()

        let check_CanReserveWithoutConfirmation: boolean
        try {
            check_CanReserveWithoutConfirmation = await this.permissionChecker.check_CanReserveWithoutConfirmation(userDB)
        } catch(e) {
            console.error(e)
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера'
            }
        }

        // Отправка письма на почту с информацией о сеансе и кодом подтверждения
        if (!check_CanReserveWithoutConfirmation) {
            const emailInfo = this.reservationInfrastructure.generateConfirmationMailMessage({
                    id_reservation: reservation.id, 
                    confirmation_code: reservation.confirmation_code,
                    play_title: sessionQuery.play_title, 
                    timestamp: sessionQuery.timestamp,
                    auditorium_title: sessionQuery.auditorium_title
            })
            this.emailSender.send(
                user.email, 
                emailInfo.subject, 
                emailInfo.message)
            .catch(e => console.error(e))
        }
        return {
            id: reservation.id,
            id_session: sessionQuery.id,
            need_confirmation: !check_CanReserveWithoutConfirmation
        }
    }

    /**
     * * Получение броней (уровень "Посетитель", "Кассир", "Администратор")
     */
    async getReservations(user: UserRequestOption) {
        // Проверка-получение роли
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUser(user.id)
            .catch(e => { throw e })
            
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!userDB) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Пользователь не найден!'
            }
        }

        try {
            // В зависимости от роли выдать либо все брони, либо только на пользователя
            let reservationsQuery: Reservation[]
            if (!(await this.permissionChecker.check_CanSeeAllReservations(userDB)))
                reservationsQuery = await this.reservationRepo.getReservationsForUser(user.id)
            else
                reservationsQuery = await this.reservationRepo.getReservations()
            
            // Отредактировать результирующий список
            const result = await this.reservationInfrastructure
                .fetchReservations(userDB, reservationsQuery)

            return result
        } catch (e) {
            console.error(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера во время поиска броней!'
            }
        }
    }

    /**
     * * Удаление брони
     */
    async deleteReservation(user: UserRequestOption, idReservation: number) {
        let idSession: number = 0

        // Проверка-получение роли
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUser(user.id)
            .catch(e => { throw e })
            
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!userDB) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Пользователь не найден!'
            }
        }
        // Проверка на наличие записи в базе данных 
        let reservation: Reservation | null
        try {
            reservation = await this.reservationRepo.getReservation(idReservation)
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера с подключением!'
            }
        }
        if (!reservation) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Запись не найдена!'
            }
        }
        // Сохранение номера сеанса, чтобы запустить событие получения слотов на сеанс
        idSession = reservation.session.id
        // Проверка на владельца брони
        let canUserDelete
        try {
            canUserDelete = await this.reservationGuard.canUserDelete(userDB, reservation)
                .catch(e => { throw e })
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!canUserDelete) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Вам запрещено удалять данную бронь!'
            }
        }
        // Создание записи действия для оператора
        if (await this.permissionChecker.check_CanSeeAllReservations(userDB)) {
            // Поиск зарезервированных мест
            let slots: SlotInterface[]
            try {
                slots = await this.reservationModel.getReservedSlots(reservation.id)
            } catch (e) {
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера во время поиска слотов!'
                }
            }
            let idsSlots = ""
            slots.forEach(slot => {
                idsSlots += `${slot.id}, `
            })
            
            const actionDescription = `Удаление брони - 
            User: ${user.id},
            ResUser: ${reservation.user.id},
            Session: ${reservation.session.id},
            Slots: ${idsSlots}`
            try {
                await this.userRepo.createUserAction(userDB.id, actionDescription)
            } catch(e) {
                console.log(e)
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера!'
                }
            }
        }
        // Удаление брони
        try {
            await this.reservationRepo.deleteReservation(idReservation)
            return idSession
        } catch (e) {
            console.error(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Ошибка в удалении записи!'
            }
        }
    }
} 