import { Reservation } from "../../entities/reservations"
import { IReservationGuard } from "../../guards/Reservation.guard"
import { IPermissionChecker } from "../../infrastructure/PermissionChecker.infra"
import { IReservationInfrastructure } from "../../infrastructure/Reservation.infra"
import { IReservationPreparator } from "../../infrastructure/ReservationPreparator.infra"
import { InnerError } from "../../interfaces/errors"
import { ReservationBaseInterface, ReservationCreateInterface, ReservationInterface } from "../../interfaces/reservations"
import { UserRequestOption } from "../../interfaces/users"
import { IReservationRepo } from "../../repositories/Reservation.repo"
import { ISessionRepo } from "../../repositories/Session.repo"
import { IUserRepo } from "../../repositories/User.repo"
import { CodeGenerator } from "../../utils/code"
import { IEmailSender } from "../../utils/email"

export interface IReservationCRUDService {
    getSingleFullInfo(idUser: number, idRole: number, idReservation: number): Promise<ReservationInterface>

    createReservation(user: UserRequestOption, requestBody: ReservationCreateInterface): Promise<{
        id: number;
        id_session: number;
        need_confirmation: boolean;
    }>

    getReservations(user: UserRequestOption): Promise<ReservationInterface[]>

    deleteReservation(user: UserRequestOption, idReservation: number): Promise<number>
}


export class ReservationCRUDService implements IReservationCRUDService {
    protected sessionRepo
    protected reservationInfrastructure
    protected reservationGuard
    protected emailSender
    protected codeGenerator
    protected userRepo
    protected permissionChecker
    protected reservationRepo
    protected reservationPreparator

    constructor(
            sessionRepoInstance: ISessionRepo,
            reservationInfrastructureInstance: IReservationInfrastructure,
            reservationGuardInstance: IReservationGuard,
            emailSenderInstance: IEmailSender,
            codeGeneratorInstance: CodeGenerator,
            userRepoInstance: IUserRepo,
            permissionCheckerInstance: IPermissionChecker,
            reservationRepoInstance: IReservationRepo,
            reservationPreparatorInstance: IReservationPreparator,
    ) {
        this.sessionRepo = sessionRepoInstance
        this.reservationInfrastructure = reservationInfrastructureInstance
        this.reservationGuard = reservationGuardInstance
        this.emailSender = emailSenderInstance
        this.codeGenerator = codeGeneratorInstance
        this.userRepo = userRepoInstance
        this.permissionChecker = permissionCheckerInstance
        this.reservationRepo = reservationRepoInstance
        this.reservationPreparator = reservationPreparatorInstance
    }

    /**
     * * Получение брони (уровень "Посетитель", "Кассир", "Администратор")
     */
    async getSingleFullInfo(idUser: number, idRole: number, idReservation: number) {
        // Проверка-получение роли
        const userDB = await this.userRepo.getUser(idUser)
        if (!userDB) throw new InnerError('Пользователь не распознан.', 403) 
        // Проверка наличия записи в базе данных
        const reservation = await this.reservationRepo.getReservation(idReservation)
        if (!reservation) throw new InnerError('Бронь не найдена!', 404)
        // Проверка на возможность доступа к брони и "ложный" 404-ответ 
        //(подразумевается 403)
        if (!(await this.permissionChecker.check_CanSeeAllReservations(userDB))) {
            if (reservation.idUser !== idUser) throw new InnerError('Бронь не найдена!', 404)
        }
        // Подготовить данные
        const result = await this.reservationPreparator.prepareReservation(userDB, reservation)
        return result
    }

    /**
     * * Создание брони
     */
    async createReservation(user: UserRequestOption, requestBody: ReservationCreateInterface) {
        // Получение роли из БД
        const userDB = await this.userRepo.getUser(user.id)
        if (!userDB) throw new InnerError('Пользователь не распознан.', 403) 
        // Проверка может ли пользователь создавать брони
        if(!(await this.permissionChecker.check_CanReserve(userDB)))
            throw new InnerError('Вам запрещено бронировать места!', 403)
        // Проверка наличия сеанса
        const sessionQuery = await this.sessionRepo.getSession(requestBody.id_session)
        if (!sessionQuery) throw new InnerError("Сеанс не найден.", 404)
        // Проверка на доступность сеанcа
        if (sessionQuery.isLocked === true)
            throw new InnerError('Бронь на сеанс закрыта!', 403)
        // Проверка на минимум слотов
        if (requestBody.slots.length === 0 ) 
            throw new InnerError('Вы не выбрали места для бронирования!', 400)
        // Проверка на максимум слотов
        if (!(await this.permissionChecker.check_CanIgnoreMaxSlotsValue(userDB))  
            && requestBody.slots.length > sessionQuery.maxSlots)
            throw new InnerError('Превышено максимальное количество мест для брони!', 403)
        // Проверка прав на создание больше одной брони на сеанс
        if (!(await this.permissionChecker.check_CanHaveMoreThanOneReservationOnSession(userDB))) {
            // Проверка на наличие брони на сеанс у пользователя
            const checkVisitorReservation = await this.reservationRepo
                .checkHasUserReservedSession(user.id, requestBody.id_session)
            console.log(userDB.role.title, checkVisitorReservation)
            if (checkVisitorReservation)
                throw new InnerError("Пользователь уже имеет брони на данный сеанс!", 403)
        }
        // Проверка на коллизию выбранных слотов и уже забронированных мест
        const reservedSlotsQuery = await this.sessionRepo
            .getReservedSlots(sessionQuery.id, sessionQuery.idPricePolicy)
        reservedSlotsQuery.forEach(reservedSlot => {
            requestBody.slots.forEach(chosenSlot => {
                if (reservedSlot.id === chosenSlot.id) {
                    throw new InnerError('Одно из мест на сеанс уже забронировано. Пожалуйста, обновите страницу.', 409)
                }
            })
        })
        // Получение разрешения на бронирование без подтверждения
        const check_CanReserveWithoutConfirmation = await this.permissionChecker.check_CanReserveWithoutConfirmation(userDB)
        // Создание брони
        const reservationPayload = <ReservationBaseInterface> {
            id_user: user.id,
            id_session: sessionQuery.id,
            confirmation_code: this.codeGenerator.generateCode()
        }
        const reservation = await this.reservationRepo
                                .createReservation(reservationPayload, check_CanReserveWithoutConfirmation, requestBody.slots)
        // Создание записи действия для оператора
        if ((await this.permissionChecker.check_CanSeeAllReservations(userDB)) 
            && (await this.permissionChecker.check_CanCreateUserActions(userDB))) {
            const actionDescription = `Создание Res:${reservation.id}`
            await this.userRepo.createUserAction(userDB.id, actionDescription)
        }
        // Отправка письма на почту с информацией о сеансе и кодом подтверждения
        if (!check_CanReserveWithoutConfirmation) {
            const emailInfo = this.reservationInfrastructure.generateConfirmationMailMessage({
                    id_reservation: reservation.id, 
                    confirmation_code: reservation.confirmationCode,
                    play_title: sessionQuery.play.title, 
                    timestamp: sessionQuery.timestamp,
                    auditorium_title: sessionQuery.pricePolicy.slots[0].seat.row.auditorium.title
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
        const userDB = await this.userRepo.getUser(user.id)
        if (!userDB) throw new InnerError('Пользователь не распознан.', 403) 
        // В зависимости от роли выдать либо все брони, либо только на пользователя
        let reservationsQuery: Reservation[]
        if (!(await this.permissionChecker.check_CanSeeAllReservations(userDB)))
            reservationsQuery = await this.reservationRepo.getReservationsForUser(user.id)
        else reservationsQuery = await this.reservationRepo.getReservations()
        // Отредактировать результирующий список
        const result: ReservationInterface[] = []
        for (const reservation of reservationsQuery) {
            const fetched = await this.reservationPreparator.prepareReservation(userDB, reservation)
            result.push(fetched)
        }
        return result
    }

    /**
     * * Удаление брони
     */
    async deleteReservation(user: UserRequestOption, idReservation: number) {
        // Проверка-получение роли
        const userDB = await this.userRepo.getUser(user.id)
        if (!userDB) throw new InnerError('Пользователь не распознан.', 403)
        // Проверка на наличие записи в базе данных 
        const reservation = await this.reservationRepo.getReservation(idReservation)
        if (!reservation) throw new InnerError('Бронь не найдена!', 404)
        // Сохранение номера сеанса, чтобы запустить событие получения слотов на сеанс
        const idSession = reservation.session.id
        // Проверка на владельца брони
        const canUserDelete = await this.reservationGuard.canUserDelete(userDB, reservation)
        if (!canUserDelete) throw new InnerError('Вам запрещено удалять данную бронь!', 403)
        // Создание записи действия для оператора
        if (await this.permissionChecker.check_CanSeeAllReservations(userDB)) {
            // Поиск зарезервированных мест
            const slots = await this.reservationRepo.getReservedSlots(idReservation)
            let idsSlots = ""
            slots.forEach(slot => {
                idsSlots += `${slot.id}, `
            })
            // Создание сообщения
            const actionDescription = `Удаление брони - 
            User: ${user.id},
            ResUser: ${reservation.user.id},
            Session: ${reservation.session.id},
            Slots: ${idsSlots}`
            // Сохранение сообщения в журнал действий пользователей
            await this.userRepo.createUserAction(userDB.id, actionDescription)
        }
        await this.reservationRepo.deleteReservation(idReservation)
        return idSession
    }
} 