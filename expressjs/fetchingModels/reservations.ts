import { KnexConnection } from "../knex/connections";
import { ReservationDatabaseInstance } from "../dbModels/reservations";
import { RoleFetchingInstance } from "./roles";
import { InnerErrorInterface, isInnerErrorInterface } from "../interfaces/errors";
import { ReservationCreateInterface, ReservationInterface, ReservationWithoutSlotsInterface,
    ReservationDatabaseInterface, ReservationBaseInterface,
    ReservationBaseWithoutConfirmationInterface, 
    ReservationConfirmationInterface} from "../interfaces/reservations";
import { SlotInterface, ReservationsSlotsBaseInterface, 
    ReservationsSlotsInterface} from "../interfaces/slots";
import { RoleDatabaseInterface } from '../interfaces/roles'
import { extendedTimestamp } from "../utils/timestamp"
import { SessionFetchingInstance } from "./sessions";
import { generateCode } from "../utils/code"
import { sendMail } from "../utils/email"
import { UserRequestOption } from "../interfaces/users";


class ReservationFetchingModel {
    protected reservationDatabaseInstance
    protected roleFetchingInstance
    protected sessionFetchingInstance

    constructor() {
        this.reservationDatabaseInstance = ReservationDatabaseInstance
        this.roleFetchingInstance = RoleFetchingInstance
        this.sessionFetchingInstance = SessionFetchingInstance
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
        if (!userRole.can_make_reservation_without_confirmation) {
            const reservationPayload: ReservationBaseInterface = {
                id_user: user.id,
                id_session: sessionQuery.id,
                confirmation_code: generateCode()
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
        }
        else {
            const reservationPayload: ReservationBaseWithoutConfirmationInterface = {
                id_user: user.id,
                id_session: sessionQuery.id,
                confirmation_code: generateCode(),
                is_confirmed: true
            }
            try {
                reservation = (await this.reservationDatabaseInstance
                    .insert( trx, reservationPayload))[0]
            } catch (e) {
                console.log(e)
                await trx.rollback()
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера!'
                }
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
                message: 'Внутренняя ошибка сервера!'
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

    async confirmReservation(user: UserRequestOption, idReservation: number, 
        requestBody: ReservationConfirmationInterface) {
        // Проверка записи брони
        let reservationQuery: ReservationDatabaseInterface | undefined
        try {
            reservationQuery = await this.reservationDatabaseInstance.get({id: idReservation})
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!reservationQuery) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Бронь не найдена!'
            }
        }

        // Проверка на владельца брони
        if (reservationQuery.id_user !== user.id) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Ошибка определения владельца брони!' 
            }
        }

        // Проверка на валидность кода подтверждения
        if (reservationQuery.confirmation_code !== requestBody.confirmation_code) {
            return <InnerErrorInterface>{
                code: 412,
                message: 'Неправильный код подтверждения!'
            }
        }

        // Транзакция: изменение флага подтверждения
        const trx = await KnexConnection.transaction()
        try {
            await this.reservationDatabaseInstance.update(trx, reservationQuery.id, {
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
        if (reservation.id_user !== user.id || (userRole.can_access_private && userRole.can_see_all_reservations)) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Вам запрещено удалять данную бронь!'
            }
        }

        // Транзакция: удаление забронированных мест, затем удаление брони
        const trx = await KnexConnection.transaction()
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

            // Расчет стоимости брони
            reservation.total_cost = this.calculateReservationTotalCost(slots)

            const canUserDelete = (reservation.id_user === idUser && !reservation.session_is_locked)
                || (userRole.can_see_all_reservations && userRole.can_access_private)
            
            result.push(<ReservationInterface>{
                ...reservation,
                can_user_delete: canUserDelete,
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
}

export const ReservationFetchingInstance = new ReservationFetchingModel()