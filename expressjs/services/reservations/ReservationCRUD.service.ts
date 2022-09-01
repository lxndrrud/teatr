import { Knex } from "knex"
import { ReservationModel } from "../../dbModels/reservations"
import { IReservationGuard } from "../../guards/Reservation.guard"
import { IReservationInfrastructure } from "../../infrastructure/Reservation.infra"
import { SessionInfrastructure } from "../../infrastructure/Session.infra"
import { IUserInfrastructure } from "../../infrastructure/User.infra"
import { InnerErrorInterface, isInnerErrorInterface } from "../../interfaces/errors"
import { ReservationBaseInterface, ReservationBaseWithoutConfirmationInterface, ReservationCreateInterface, ReservationDatabaseInterface, ReservationInterface, ReservationWithoutSlotsInterface } from "../../interfaces/reservations"
import { ReservationsSlotsBaseInterface, SlotInterface } from "../../interfaces/slots"
import { UserRequestOption } from "../../interfaces/users"
import { CodeGenerator } from "../../utils/code"
import { EmailSender } from "../../utils/email"
import { RoleService } from "../roles"
import { SessionCRUDService } from "../sessions/SessionCRUD.service"
import { IUserCRUDService } from "../users/UsersCRUD.service"

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

    constructor(
            connectionInstance: Knex<any, unknown[]>,
            reservationDatabaseInstance: ReservationModel,
            roleServiceInstance: RoleService,
            sessionCRUDServiceInstance: SessionCRUDService,
            sessionInfrastructure: SessionInfrastructure,
            userInfrastructureInstance: IUserInfrastructure,
            reservationInfrastructureInstance: IReservationInfrastructure,
            reservationGuardInstance: IReservationGuard,
            emailSenderInstance: EmailSender,
            codeGeneratorInstance: CodeGenerator
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
    }

    /**
     * * Получение брони (уровень "Посетитель", "Кассир", "Администратор")
     */
    async getSingleFullInfo(idUser: number, idRole: number, idReservation: number) {
        // Проверка-получение роли
        let userRole = await this.roleService
            .getUserRole(idUser, idRole)
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }
        
        // Проверка наличия записи в базе данных
        const reservationQuery: ReservationInterface | undefined = await this.reservationModel
            .getSingleFullInfo(idReservation)
        if (!reservationQuery) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Бронь не найдена!'
            }
        }

        // Проверка на возможность доступа к брони и "ложный" 404-ответ 
        //(подразумевается 403)
        if (!userRole.can_see_all_reservations) {
            if (reservationQuery.id_user !== idUser) {
                return <InnerErrorInterface>{
                    code: 404,
                    message: 'Бронь не найдена!'
                }
            }
        }
        

        const result = await this.reservationInfrastructure.fetchReservations(
                idUser,
                userRole,
                [reservationQuery])

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
        let userRole = await this.roleService.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
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
        if (!userRole.can_avoid_max_slots_property && requestBody.slots.length > sessionQuery.max_slots) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Превышено максимальное количество мест для брони!'
            }
        }

        if (!userRole.can_have_more_than_one_reservation_on_session) {
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
        if (!userRole.can_make_reservation_without_confirmation) {
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
        if (userRole.can_see_all_reservations) {
            const actionDescription = `Создание брони ${reservation.id}`
            const response = await this.userInfrastructure
                .createAction(trx, user.id, userRole, actionDescription)
            if (isInnerErrorInterface(response)) {
                return response
            }
        }

        await trx.commit()

        // Отправка письма на почту с информацией о сеансе и кодом подтверждения
        if (!userRole.can_make_reservation_without_confirmation)
            this.emailSender.send(
                user.email, 
                "Бронь в театре на Оборонной", 
                this.reservationInfrastructure.generateConfirmationMailMessage({
                    id_reservation: reservation.id, 
                    confirmation_code: reservation.confirmation_code,
                    play_title: sessionQuery.play_title, 
                    timestamp: sessionQuery.timestamp,
                    auditorium_title: sessionQuery.auditorium_title
                })
            )
        return {
            id: reservation.id,
            id_session: sessionQuery.id,
            need_confirmation: !userRole.can_make_reservation_without_confirmation
        }
    }

    /**
     * * Получение броней (уровень "Посетитель", "Кассир", "Администратор")
     */
    async getReservations(user: UserRequestOption) {
        // Проверка-получение роли
        let userRole = await this.roleService.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        try {
            // В зависимости от роли выдать либо все брони, либо только на пользователя
            let reservationsQuery: ReservationWithoutSlotsInterface[]
            if (!userRole.can_see_all_reservations)
                reservationsQuery = await this.reservationModel.getUserReservations(user.id)
            else
                reservationsQuery = await this.reservationModel.getAllFullInfo()
            
            // Отредактировать результирующий список
            const result = await this.reservationInfrastructure
                .fetchReservations(user.id, userRole, reservationsQuery)

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
        let userRole = await this.roleService.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        // Проверка на наличие записи в базе данных 
        let reservation: ReservationWithoutSlotsInterface | undefined

        try {
            reservation = await this.reservationModel.getSingleFullInfo(idReservation)
        } catch (e) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера во время поиска брони!'
            }
        }
        if (!reservation) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Запись не найдена!'
            }
        }
        idSession = reservation.id_session

        // Проверка на владельца брони
        const canUserDelete = this.reservationGuard.canUserDelete(reservation, user.id, userRole)
        if (!canUserDelete) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Вам запрещено удалять данную бронь!'
            }
        }

        // Транзакция: удаление забронированных мест, затем удаление брони
        const trx = await this.connection.transaction()

        // Создание записи действия пользователя
        if (userRole.can_see_all_reservations) {
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
            ResUser: ${reservation.id_user},
            Session: ${reservation.id_session},
            Slots: ${idsSlots}`
            const response = await this.userInfrastructure
                .createAction(trx, user.id, userRole, actionDescription)
            if (isInnerErrorInterface(response)) {
                return response
            }
        }

        try {
            await this.reservationModel.deleteReservationsSlots(trx, idReservation)
            await this.reservationModel.delete(trx, idReservation)
            await trx.commit()
            return idSession
        } catch (e) {
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Ошибка в удалении записи!'
            }
        }
    }
} 