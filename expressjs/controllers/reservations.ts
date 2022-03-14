import { KnexConnection } from "../knex/connections"
import { Request, Response } from "express"
//* Interfaces
import { UserBaseInterface, UserInterface } from "../interfaces/users"
import { SlotInterface, ReservationsSlotsBaseInterface } from "../interfaces/slots"
import { ErrorInterface } from "../interfaces/errors"
import { ReservationBaseInterface, ReservationInterface, 
    ReservationPostEmailInterface, ReservationDatabaseInterface, ReservationConfirmationInterface} from "../interfaces/reservations"
import { SessionInterface } from "../interfaces/sessions"
//* Models
import * as UserModel from '../models/users'
import * as ReservationModel from "../models/reservations"
import * as SessionModel from "../models/sessions"
import * as RoleModel from "../models/roles"
import { generateCode } from "../utils/code"
import { sendMail } from "../utils/email"

export const getSingleReservation = async (req: Request, res: Response) => {
    const idReservation = parseInt(req.params.idReservation)
    if (!idReservation) {
        res.status(400).end()
        return
    }
    const reservationQuery = await ReservationModel.getSingleReservation(idReservation)
    if (!reservationQuery) {
        res.status(404).end()
        return
    }
    try {
        const slots = await ReservationModel.getReservedSlots(idReservation)
        const reservation: ReservationInterface = {...reservationQuery, slots}
        res.status(200).send(reservation)
    } catch (e) {
        console.log(e)
        res.status(500).end()
    }
}

export const postReservation = async (req: Request, res: Response) => {
    try {
        const requestBody: ReservationPostEmailInterface = {...req.body}
        const sessionQuery = await SessionModel.getSingleSession(requestBody.id_session)
        if (!sessionQuery) {
            res.status(404).end()
            return
        }
        // Проверка на доступность сеанcf
        if (sessionQuery.is_locked === true) {
            const error: ErrorInterface = {
                message:'Бронь на сеанс закрыта!'
            }
            res.status(403).send(error)
            return
        }

        // Проверка на максимум слотов
        if (requestBody.slots.length > sessionQuery.max_slots) {
            const error: ErrorInterface = {
                message:'Превышено максимальное количество мест для брони!'
            }
            res.status(403).send(error)
            return
        }

        // Проверка на коллизию выбранных слотов и уже забронированных
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
            if(slotCheck.length > 0) break
        }
        
        if (slotCheck.length > 0) {
            const error: ErrorInterface = {
                message: 'Одно из мест на сеанс уже забронировано. Пожалуйста, обновите страницу.'
            }
            res.status(409).send(error)
            return
        } 

        // Проверка наличия почтовой записи
        let userQuery = await UserModel.getUser(requestBody.id_user)
        const trx = await KnexConnection.transaction()
        if (!userQuery) {
            const error: ErrorInterface = {
                message: 'Пользователь не найден'
            }
            res.status(404).send(error)
            return

            //* Было до реворка Record в User
            /*
            const payload: RecordBaseInterface = {
                email: requestBody.email
            }
            recordQuery = (await RecordModel.createRecord(trx, payload))[0]
            */

            /*
            const visitorRoleQuery = await RoleModel.getVisitorRole()
            if (!visitorRoleQuery) res.status(500).end()
            else {
                const userPayload: UserBaseInterface = {
                    password: `${generateCode()}${generateCode()}`,
                    id_record: recordQuery.id,
                    id_role: visitorRoleQuery.id
                }
                const user = (await UserModel.createUser(trx, userPayload))[0]
            }
            */
        }

        const reservationPayload: ReservationBaseInterface = {
            id_user: userQuery.id,
            id_session: sessionQuery.id,
            code: generateCode(),
            confirmation_code: generateCode()
        }

        const reservation: ReservationDatabaseInterface = (await ReservationModel.createReservation(trx, 
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

        sendMail(userQuery.email, reservation.confirmation_code,
            reservation.code, sessionQuery.play_title, sessionQuery.timestamp,
            sessionQuery.auditorium_title)

        res.status(201).send({
            id_reservation: reservation.id,
            id_session: sessionQuery.id,
            code: reservation.code
        })
    } catch(e) {
        console.log(e)
        const error: ErrorInterface = {
            message: 'Неверный синтаксис запроса'
        }
        res.status(400).send(error)
    }
}


export const confirmReservation = async (req: Request, res: Response) => {
    const idReservation: number = parseInt(req.params.idReservation)
    const requestBody: ReservationConfirmationInterface = {...req.body}
    const reservationQuery = await ReservationModel.getSingleReservation(idReservation)
    if (!reservationQuery) {
        res.status(404).end()
        return
    }
    if (reservationQuery.confirmation_code !== requestBody.confirmation_code) {
        res.status(412).end()
        return
    }
    reservationQuery.is_confirmed = true
    const trx = await KnexConnection.transaction()
    try {
        await ReservationModel.updateReservation(trx, reservationQuery)
        await trx.commit()
        res.status(200).end()
    } catch (e) {
        const error: ErrorInterface = {
            message: 'Ошибка в изменении записи!'
        } 
        await trx.rollback()
        console.log(e)
        res.status(500).send(error)
    }
}

export const deleteReservation = async (req: Request, res: Response) => {
    const idReservation = parseInt(req.params.idReservation)
    if (!idReservation) {
        res.status(400).end()
        return
    }
    const reservation = await ReservationModel.getSingleReservation(idReservation)
    if (!reservation) {
        res.status(404).end()
        return
    }
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
