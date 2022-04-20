import { KnexConnection } from "../knex/connections";
import { ReservationDatabaseInstance } from "../dbModels/reservations";
import { RoleFetchingInstance } from "./roles";
import { InnerErrorInterface, isInnerErrorInterface } from "../interfaces/errors";
import { ReservationCreateInterface, ReservationInterface, ReservationWithoutSlotsInterface,
    ReservationDatabaseInterface, ReservationBaseInterface,
    ReservationBaseWithoutConfirmationInterface, 
    ReservationConfirmationInterface,
    ReservationFilterQueryInterface} from "../interfaces/reservations";
import { SlotInterface, ReservationsSlotsBaseInterface, 
    ReservationsSlotsInterface} from "../interfaces/slots";
import { RoleDatabaseInterface } from '../interfaces/roles'
import { extendedTimestamp } from "../utils/timestamp"
import { SessionFetchingInstance } from "./sessions";
import { generateCode } from "../utils/code"
import { sendMail } from "../utils/email"
import { UserRequestOption } from "../interfaces/users";
import { TimestampReservationFilterOptionDatabaseInterface, TimestampReservationFilterOptionInterface } from "../interfaces/timestamps";
import { AuditoriumReservationFilterOption } from "../interfaces/auditoriums";
import { PlayReservationFilterOptionInterface } from "../interfaces/plays";
import { dateFromTimestamp, extendedDateFromTimestamp } from "../utils/timestamp"
import { UserFetchingInstance } from "./users";


class ReservationFetchingModel {
    protected reservationDatabaseInstance
    protected roleFetchingInstance
    protected sessionFetchingInstance
    protected userFetchingInstance

    constructor() {
        this.reservationDatabaseInstance = ReservationDatabaseInstance
        this.roleFetchingInstance = RoleFetchingInstance
        this.sessionFetchingInstance = SessionFetchingInstance
        this.userFetchingInstance = UserFetchingInstance
    }

    async getAllFullInfo() {
        try {
            const query: ReservationInterface[] = await this.reservationDatabaseInstance
                .getAllFullInfo()
            return query
        } catch (e) {
            return 500
        }
    }

    async getSingleFullInfo(idUser: number, idRole: number, idReservation: number) {
        // Проверка-получение роли
        let userRole = await this.roleFetchingInstance
            .getUserRole(idUser, idRole)
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }
        
        // Проверка наличия записи в базе данных
        const reservationQuery: ReservationInterface | undefined = await this.reservationDatabaseInstance
            .getSingleFullInfo(idReservation)
        if (!reservationQuery) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Бронь не найдена!'
            }
        }

        const result = await this.fetchReservations(
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
        let userRole = await this.roleFetchingInstance.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        // Проверка наличия сеанса
        const sessionQuery = await this.sessionFetchingInstance
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

        // Проверка на максимум слотов
        if (requestBody.slots.length > sessionQuery.max_slots) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Превышено максимальное количество мест для брони!'
            }
        }

        // Проверка на наличие брони на сеанс у пользователя
        const checkVisitorReservation = await this
            .checkUserHasReservedSession(user.id, requestBody.id_session)

        if (!userRole.can_have_more_than_one_reservation_on_session && checkVisitorReservation) {
            return <InnerErrorInterface> {
                code: 403,
                message: "Пользователь уже имеет брони на данный сеанс!"
            }
        }

        // Проверка на коллизию выбранных слотов и уже забронированных мест
        const reservedSlotsQuery = await this.sessionFetchingInstance
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
        const trx = await KnexConnection.transaction()

        let reservation: ReservationDatabaseInterface

        let reservationPayload: ReservationBaseInterface | ReservationBaseWithoutConfirmationInterface
        if (!userRole.can_make_reservation_without_confirmation) {
            reservationPayload = {
                id_user: user.id,
                id_session: sessionQuery.id,
                confirmation_code: generateCode()
            }
        }
        else {
            reservationPayload = {
                id_user: user.id,
                id_session: sessionQuery.id,
                confirmation_code: generateCode(),
                is_confirmed: true
            }
        }

        try {
            reservation = (await this.reservationDatabaseInstance
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
            await this.reservationDatabaseInstance.insertReservationsSlotsList(trx, slots)
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
            const response = await this.userFetchingInstance
                .createAction(trx, user.id, userRole, actionDescription)
            if (isInnerErrorInterface(response)) {
                return response
            }
        }

        await trx.commit()

        // Отправка письма на почту с информацией о сеансе и кодом подтверждения
        if (!userRole.can_make_reservation_without_confirmation)
            sendMail(user.email, reservation.confirmation_code,
                reservation.id, sessionQuery.play_title, sessionQuery.timestamp,
                sessionQuery.auditorium_title)
        
        return {
            id: reservation.id,
            id_session: sessionQuery.id,
            need_confirmation: !userRole.can_make_reservation_without_confirmation
        }
    }

    /**
     * * Подтверждение брони
     */
    async confirmReservation(user: UserRequestOption, idReservation: number, 
        requestBody: ReservationConfirmationInterface) {
        // Получение роли из БД
        let userRole = await this.roleFetchingInstance.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        // Проверка на наличие записи в базе данных 
        let reservation: ReservationWithoutSlotsInterface | undefined

        try {
            reservation = await this.reservationDatabaseInstance.getSingleFullInfo(idReservation)
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

        // Проверка на доступность подтверждения
        const canUserConfirm = this.canUserConfirm(reservation, user.id, userRole)
        if (!canUserConfirm) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Пользователю данная операция не доступна!' 
            }
        }

        // Проверка на валидность кода подтверждения
        if (reservation.confirmation_code !== requestBody.confirmation_code) {
            return <InnerErrorInterface>{
                code: 412,
                message: 'Неправильный код подтверждения!'
            }
        }

        // Транзакция: изменение флага подтверждения
        const trx = await KnexConnection.transaction()

        // Создание записи действия для оператора
        if (userRole.can_see_all_reservations) {
            const actionDescription = `Подтверждение брони Res:${reservation.id}`
            const response = await this.userFetchingInstance
                .createAction(trx, user.id, userRole, actionDescription)
            if (isInnerErrorInterface(response)) {
                return response
            }
        }

        try {
            await this.reservationDatabaseInstance.update(trx, reservation.id, {
                is_confirmed: true
            })
            await trx.commit()
        } catch (e) { 
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Ошибка в изменении записи!'
            }
        }
    }

    /**
     * * Изменение статуса оплаты (из false в true)
     */
    async paymentForReservation(user: UserRequestOption, idReservation: number) {
        // Получение роли из БД
        let userRole = await this.roleFetchingInstance.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        // Проверка на наличие записи в базе данных 
        let reservation: ReservationWithoutSlotsInterface | undefined

        try {
            reservation = await this.reservationDatabaseInstance.getSingleFullInfo(idReservation)
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

        // Проверка прав
        const canUserPay = this.canUserPay(reservation, user.id, userRole)
        if (!canUserPay) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'У пользователя недостаточно прав для совершения этой операции!'
            }
        }

        // Транзакция: изменение флага оплаты
        const trx = await KnexConnection.transaction()

        // Создание записи действия для оператора
        if (userRole.can_see_all_reservations) {
            const actionDescription = `Изменение флага оплаты на ${!reservation.is_paid}`
            const response = await this.userFetchingInstance
                .createAction(trx, user.id, userRole, actionDescription)
            if (isInnerErrorInterface(response)) {
                return response
            }
        }

        try {
            await this.reservationDatabaseInstance.update(trx, reservation.id, {
                is_paid: !reservation.is_paid
            })
            await trx.commit()
        } catch (e) { 
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Ошибка в изменении записи!'
            }
        }
    }

    /**
     * * Получение броней (уровень "Посетитель", "Кассир", "Администратор")
     */
    async getReservations(user: UserRequestOption) {
        // Проверка-получение роли
        let userRole = await this.roleFetchingInstance.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        try {
            // В зависимости от роли выдать либо все брони, либо только на пользователя
            let reservationsQuery: ReservationWithoutSlotsInterface[]
            if (!userRole.can_see_all_reservations)
                reservationsQuery = await this.reservationDatabaseInstance.getUserReservations(user.id)
            else
                reservationsQuery = await this.reservationDatabaseInstance.getAllFullInfo()
            
            // Отредактировать результирующий список
            const result = await this.fetchReservations(user.id, userRole, reservationsQuery)

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
        // Проверка-получение роли
        let userRole = await this.roleFetchingInstance.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        // Проверка на наличие записи в базе данных 
        let reservation: ReservationWithoutSlotsInterface | undefined

        try {
            reservation = await this.reservationDatabaseInstance.getSingleFullInfo(idReservation)
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

        // Проверка на владельца брони
        const canUserDelete = this.canUserDelete(reservation, user.id, userRole)
        if (!canUserDelete) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Вам запрещено удалять данную бронь!'
            }
        }

        // Транзакция: удаление забронированных мест, затем удаление брони
        const trx = await KnexConnection.transaction()

        // Создание записи действия пользователя
        if (userRole.can_see_all_reservations) {
            // Поиск зарезервированных мест
            let slots: SlotInterface[]
            try {
                slots = await this.reservationDatabaseInstance.getReservedSlots(reservation.id)
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
            const response = await this.userFetchingInstance
                .createAction(trx, user.id, userRole, actionDescription)
            if (isInnerErrorInterface(response)) {
                return response
            }
        }

        try {
            await this.reservationDatabaseInstance.deleteReservationsSlots(trx, idReservation)
            await this.reservationDatabaseInstance.delete(trx, idReservation)
            await trx.commit()
        } catch (e) {
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Ошибка в удалении записи!'
            }
        }
    }

    /**
     * * Получение значений для фильтра броней
     */
    async getReservationFilterOptions(user: UserRequestOption) {
        // Проверка-получение роли
        let userRole = await this.roleFetchingInstance.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        // dates, auditoriums, plays but without isLocked, reservationNumber
        let timestamps: TimestampReservationFilterOptionDatabaseInterface[],
            auditoriums: AuditoriumReservationFilterOption[],
            plays: PlayReservationFilterOptionInterface[]

        try {
            if (userRole.can_see_all_reservations)
                [timestamps, auditoriums, plays] = await Promise.all([
                    this.reservationDatabaseInstance.getTimestampsOptionsForReservationFilter(),
                    this.reservationDatabaseInstance.getAuditoriumsOptionsForReservationFilter(),
                    this.reservationDatabaseInstance.getPlaysOptionsForReservationFilter()
                ])
            else 
                [timestamps, auditoriums, plays] = await Promise.all([
                    this.reservationDatabaseInstance.getTimestampsOptionsForReservationFilter(user.id),
                    this.reservationDatabaseInstance.getAuditoriumsOptionsForReservationFilter(user.id),
                    this.reservationDatabaseInstance.getPlaysOptionsForReservationFilter(user.id)
                ])
                
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске значений для фильтра броней!'
            }
        }

        let dates: TimestampReservationFilterOptionInterface[] = []
        let distinctCheck: Map<string, string> = new Map()
        for (let row of timestamps) {
            const extendedDate = extendedDateFromTimestamp(row.timestamp)
            const simpleDate = dateFromTimestamp(row.timestamp)
            if (!distinctCheck.has(simpleDate)) {
                dates.push({
                    date: simpleDate,
                    extended_date: extendedDate
                })
                distinctCheck.set(simpleDate, simpleDate)
            }
        }

        return {
            dates, auditoriums, plays
        }

    }

    /**
     * * Получение отфильтрованных броней
     */
    async getFilteredReservations(userQuery: ReservationFilterQueryInterface, user: UserRequestOption) {
        // Проверка-получение роли
        let userRole = await this.roleFetchingInstance.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        try {
            // В зависимости от роли выдать либо часть всех броней,
            // либо часть пользовательских броней
            let query: ReservationWithoutSlotsInterface[]
            if (!userRole.can_see_all_reservations)
                query = await this.reservationDatabaseInstance
                    .getFilteredReservationsForUser(userQuery, user.id)
            else 
                query = await this.reservationDatabaseInstance
                    .getFilteredReservations(userQuery)

            // Отредактировать результирующий список
            const result = await this.fetchReservations(user.id, userRole, query)
            
            return result
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при фильтрации броней!'
            }
        }
    }

    /**
     * * Расчет стоимости брони
     */
    calculateReservationTotalCost (slots: SlotInterface[]) {
        let totalCost = 0
        for (let slot of slots) {
            totalCost += slot.price
        }
        return totalCost
    }

    /**
     * * Вывести полную информацию о бронях с необходимым редактированием
     */
    async fetchReservations(idUser: number, userRole: RoleDatabaseInterface, reservations: ReservationWithoutSlotsInterface[]): Promise<ReservationInterface[] | InnerErrorInterface> {
        let result: ReservationInterface[] = []  
        for (let reservation of reservations) {
            // Редактирование формата timestamp`ов
            reservation.session_timestamp = extendedTimestamp(reservation.session_timestamp)
            reservation.created_at = extendedTimestamp(reservation.created_at)

            // Скрыть код подтверждения
            reservation.confirmation_code = ''

            // Поиск зарезервированных мест
            let slots: SlotInterface[]
            try {
                slots = await this.reservationDatabaseInstance.getReservedSlots(reservation.id)
            } catch (e) {
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера во время поиска слотов!'
                }
            }

            // Проверка на возможность удаления брони
            const canUserDelete = this.canUserDelete(reservation, idUser, userRole)

            // Проверка на возможность подтверждения брони
            const canUserConfirm = this.canUserConfirm(reservation, idUser, userRole)

            // Проверка на возможность оплаты брони
            const canUserPay = this.canUserPay(reservation, idUser, userRole)
            
            result.push(<ReservationInterface>{
                ...reservation,
                can_user_delete: canUserDelete,
                can_user_confirm: canUserConfirm,
                can_user_pay: canUserPay,
                // Расчет стоимости брони
                total_cost: this.calculateReservationTotalCost(slots),
                slots: slots
            })
        }
        return result
    }

    /**
     * * Проверка наличия у пользователя броней на сеанс
     */
    async checkUserHasReservedSession (idUser: number, idSession: number): Promise<boolean> {
        const query = await this.reservationDatabaseInstance.getAll({
            id_user: idUser,
            id_session: idSession
        })
        if (query.length > 0) return true
        return false
    }

    canUserDelete(reservation: ReservationWithoutSlotsInterface, idUser: number, userRole: RoleDatabaseInterface) {
        return (reservation.id_user === idUser && !reservation.session_is_locked)
        || (userRole.can_see_all_reservations && userRole.can_access_private)
    }

    canUserConfirm(reservation: ReservationWithoutSlotsInterface, idUser: number, userRole: RoleDatabaseInterface) {
        return reservation.id_user === idUser && !reservation.session_is_locked 
            && !reservation.is_confirmed
    }

    canUserPay(reservation: ReservationWithoutSlotsInterface, idUser: number, userRole: RoleDatabaseInterface) {
        return userRole.can_see_all_reservations 
            && !reservation.is_paid && !reservation.session_is_locked
    }
}

export const ReservationFetchingInstance = new ReservationFetchingModel()