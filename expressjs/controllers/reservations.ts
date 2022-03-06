import { KnexConnection } from "../knex/connections"
import { Request, Response } from "express"
//* Interfaces
import { RecordBaseInterface, RecordInterface } from "../interfaces/records"
import { SlotInterface, ReservationsSlotsBaseInterface } from "../interfaces/slots"
import { ErrorInterface } from "../interfaces/errors"
import { ReservationBaseInterface, ReservationInterface, 
    ReservationPostEmailInterface, ReservationDatabaseInterface} from "../interfaces/reservations"
import { SessionInterface } from "../interfaces/sessions"
//* Models
import * as RecordModel from '../models/records'
import * as ReservationModel from "../models/reservations"
import * as SessionModel from "../models/sessions"
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
        const slotsQuery = await ReservationModel.getReservedSlots(idReservation)
        const slots: SlotInterface[] = [...slotsQuery]
        const reservation: ReservationInterface = {...reservationQuery, slots}
        res.status(200).send(reservation)
    } catch (e) {
        console.log(e)
        res.status(500).end()
    }
}

export const postReservation = async (req: Request, res: Response) => {
    try{
        const requestBody: ReservationPostEmailInterface = {...req.body}
        const sessionQuery = await SessionModel.getSingleSession(requestBody.id_session)
        if (!sessionQuery) {
            res.status(404).end()
            return
        }
        const session: SessionInterface = {...sessionQuery}
        // Проверка на доступность сеанcf
        if (session.is_locked === true) {
            const error: ErrorInterface = {
                message:'Бронь на сеанс закрыта!'
            }
            res.status(403).send(error)
            return
        }

        // Проверка на максимум слотов
        if (requestBody.slots.length > session.max_slots) {
            const error: ErrorInterface = {
                message:'Превышено максимальное количество мест для брони!'
            }
            res.status(403).send(error)
            return
        }

        // Проверка на коллизию выбранных слотов и уже забронированных
        const reservedSlotsQuery = await SessionModel.getReservedSlots(session.id, 
            session.id_price_policy)

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
        const recordQuery = await RecordModel.getRecordByEmail(requestBody.email)
        const trx = await KnexConnection.transaction()
        let record: RecordInterface
        if (!recordQuery) {
            const payload: RecordBaseInterface = {
                email: requestBody.email
            }
            record = (await RecordModel.createRecord(trx, payload))[0]
        }
        else {
            record = {...recordQuery}
        }
        const reservationPayload: ReservationBaseInterface = {
            id_record: record.id,
            id_session: session.id,
            code: generateCode(),
            confirmation_code: generateCode()
        }

        const reservation: ReservationDatabaseInterface= (await ReservationModel.createReservation(trx, 
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

        sendMail(record.email, reservation.confirmation_code,
            reservation.code, session.play_title, session.timestamp,
            session.auditorium_title)

        res.status(201).send({
            id_reservation: reservation.id,
            id_session: session.id,
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