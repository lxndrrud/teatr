// * Библиотеки
import { KnexConnection } from "../knex/connections"
import { Request, Response } from "express"
// * Интерфейсы
import { SlotInterface, ReservationsSlotsBaseInterface } from "../interfaces/slots"
import { ErrorInterface } from "../interfaces/errors"
import { ReservationBaseInterface, ReservationInterface, 
    ReservationCreateInterface, ReservationDatabaseInterface, ReservationConfirmationInterface, isReservationCreateInterface, isReservationConfirmationInterface, ReservationWithoutSlotsInterface} from "../interfaces/reservations"
// * Модели
import * as ReservationModel from "../models/reservations"
import * as SessionModel from "../models/sessions"
// * Утилиты
import { generateCode } from "../utils/code"
import { sendMail } from "../utils/email"

/**
 * * Получение записи брони (уровень 'Посетитель')
 */
export const getSingleReservation = async (req: Request, res: Response) => {
    // * Проверка авторизации
    if (!req.user) {
        res.status(401).end()
        return
    }

    // * Проверка строки запроса
    const idReservation = parseInt(req.params.idReservation)
    if (!idReservation) {
        res.status(400).end()
        return
    }

    
    try {
        // * Проверка наличия записи в базе данных
        const reservationQuery = await ReservationModel.getSingleReservation(idReservation)
        if (!reservationQuery) {
            res.status(404).end()
            return
        }

        // * Проверка на владельца брони
        if (reservationQuery.id_user !== req.user.id) {
            res.status(403).end()
            return
        }
        
        const slots = await ReservationModel.getReservedSlots(idReservation)

        const reservation: ReservationInterface = {...reservationQuery, slots}
        res.status(200).send(reservation)
    } catch (e) {
        console.log(e)
        res.status(500).end()
    }
}

/**
 * * Создание брони (уровень 'Посетитель') 
 */
export const postReservation = async (req: Request, res: Response) => {
    // * Проверка авторизации
    if (!req.user) {
        res.status(401).end()
        return
    }

    // * Проверка тела запроса на соответствие интерфейсу
    let requestBody: ReservationCreateInterface
    if (!isReservationCreateInterface(req.body)) {
        const error: ErrorInterface = {
            message: 'Неверный синтаксис запроса!'
        }
        res.status(400).send(error)
        return
    }
    requestBody = {...req.body}

    // * Проверка наличия сеанса
    const sessionQuery = await SessionModel.getSingleSession(requestBody.id_session)
    if (!sessionQuery) {
        res.status(404).end()
        return
    }

    // * Проверка на доступность сеанcа
    if (sessionQuery.is_locked === true) {
        const error: ErrorInterface = {
            message:'Бронь на сеанс закрыта!'
        }
        res.status(403).send(error)
        return
    }

    // * Проверка на максимум слотов
    if (requestBody.slots.length > sessionQuery.max_slots) {
        const error: ErrorInterface = {
            message:'Превышено максимальное количество мест для брони!'
        }
        res.status(403).send(error)
        return
    }

    // * Проверка на коллизию выбранных слотов и уже забронированных мест
    const reservedSlotsQuery = await SessionModel.getReservedSlots(sessionQuery.id, 
        sessionQuery.id_price_policy)

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
            const error: ErrorInterface = {
                message: 'Одно из мест на сеанс уже забронировано. Пожалуйста, обновите страницу.'
            }
            res.status(409).send(error)
            return
        }
    }

    // * Транзакция: создание брони и забронированных мест
    const trx = await KnexConnection.transaction()

    const reservationPayload: ReservationBaseInterface = {
        id_user: req.user.id,
        id_session: sessionQuery.id,
        confirmation_code: generateCode()
    }

    const reservation = (await ReservationModel.createReservation(trx, 
        reservationPayload))[0]

    let slots: ReservationsSlotsBaseInterface[] = []
    for (let slot of requestBody.slots) {
        const item: ReservationsSlotsBaseInterface = {
            id_slot: slot.id,
            id_reservation: reservation.id
        }
        slots.push(item)
    }
    await ReservationModel.createReservationsSlotsList(trx, slots)
    await trx.commit()

    // * Отправка письма на почту с инофрмацией о сеансе и кодом подтверждения
    sendMail(req.user.email, reservation.confirmation_code,
        reservation.id, sessionQuery.play_title, sessionQuery.timestamp,
        sessionQuery.auditorium_title)

    res.status(201).send({
        id: reservation.id,
        id_session: sessionQuery.id,
    })
}

/**
 * * Подтверждение брони (уровень 'Посетитель')
 */
export const confirmReservation = async (req: Request, res: Response) => {
    // * Проверка на авторизованность
    if (!req.user) {
        res.status(401).send(<ErrorInterface>{
            message: 'Ошибка авторизации!'
        })
        return
    }

    // * Проверка строки запроса
    const idReservation = parseInt(req.params.idReservation)
    if (!idReservation) {
        res.status(400).send(<ErrorInterface>{
            message: 'Ошибка в строке запроса!'
        })
        return
    }

    // * Проверка тела запроса
    let requestBody: ReservationConfirmationInterface
    if (!isReservationConfirmationInterface(req.body)) {
        res.status(400).send(<ErrorInterface>{
            message: 'Ошибка в теле запроса!'
        })
        return
    }
    requestBody = {...req.body}

    // * Проверка записи брони
    let reservationQuery: ReservationWithoutSlotsInterface | undefined
    try {
        reservationQuery = await ReservationModel.getSingleReservation(idReservation)
    } catch(e) {
        console.log(e)
        res.status(500).send(<ErrorInterface>{
            message: 'Внутрення ошибка сервера!'
        })
        return
    }
    if (!reservationQuery) {
        res.status(404).send(<ErrorInterface>{
            message: 'Бронь не найдена!'
        })
        return
    }

    // * Проверка на владельца брони
    if (reservationQuery.id_user !== req.user.id) {
        res.status(403).send(<ErrorInterface>{
            message: 'Ошибка определения владельца брони!' 
        })
        return
    }

    // * Проверка на валидность кода подтверждения
    if (reservationQuery.confirmation_code !== requestBody.confirmation_code) {
        res.status(412).send(<ErrorInterface>{
            message: 'Неправильный код подтверждения!'
        })
        return
    }

    // * Транзакция: изменение флага подтверждения
    reservationQuery.is_confirmed = true
    const trx = await KnexConnection.transaction()
    try {
        await ReservationModel.updateReservation(trx, reservationQuery)
        await trx.commit()
        res.status(200).end()
    } catch (e) { 
        await trx.rollback()
        console.log(e)
        res.status(500).send(<ErrorInterface>{
            message: 'Ошибка в изменении записи!'
        })
    }
}

/**
 * * Удаление брони (уровень 'Посетитель')
 */
export const deleteReservation = async (req: Request, res: Response) => {
    // * Проверка на авторизованность
    if (!req.user) {
        res.status(401).end()
        return
    }

    // * Проверка строки запроса
    const idReservation = parseInt(req.params.idReservation)
    if (!idReservation) {
        res.status(400).end()
        return
    }
    // * Проверка на наличие записи в базе данных 
    let reservation: ReservationWithoutSlotsInterface | undefined
    try {
        reservation = await ReservationModel.getSingleReservation(idReservation)
    } catch(e) {
        console.log(e)
        res.status(500).end()
        return
    }
    if (!reservation) {
        res.status(404).end()
        return
    }

    // * Проверка на владельца брони
    if (reservation.id_user !== req.user.id) {
        res.status(403).end()
        return
    }

    // * Транзакция: удаление забронированных мест, затем удаление брони
    const trx = await KnexConnection.transaction()
    try {
        await ReservationModel.deleteReservationsSlots(trx, idReservation)
        await ReservationModel.deleteReservation(trx, idReservation)
        await trx.commit()
        res.status(200).end()
    } catch (e) {
        const error: ErrorInterface = {
            message: 'Ошибка в удалении записи!'
        } 
        await trx.rollback()
        console.log(e)
        res.status(500).send(error)
    }
}

export const getUserReservations = async (req: Request, res: Response) => {
    // * Проверка на авторизованность
    if (!req.user) {
        res.status(401).send(<ErrorInterface>{
            message: 'Ошибка авторизации!'
        })
        return
    }

    try {
        const reservationsQuery = await ReservationModel.getUserReservations(req.user.id) 
        res.status(200).send(reservationsQuery)
    } catch (e) {
        console.log(e)
        res.status(500).send(<ErrorInterface>{
            message: 'Внутренняя ошибка сервера!'
        })
        return
    }
}
