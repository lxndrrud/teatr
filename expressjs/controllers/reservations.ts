import { KnexConnection } from "../knex/connections"
import { Request, Response } from "express"
import { SlotInterface, ReservationInterface } from "../interfaces/reservations"
import { SessionInterface } from "../interfaces/sessions"
import * as ReservationModel from "../models/reservations"
import * as SessionModel from "../models/sessions"

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
    const idSession = parseInt(`${req.query.idSession}`)
    if (!idSession) {
        res.status(400).end()
        return
    }
    const sessionQuery = await SessionModel.getSingleSession(idSession)
    if (!sessionQuery) {
        res.status(404).end()
        return
    }
    const session: SessionInterface = {...sessionQuery}
    if (session.is_locked === true) {
        res.status(403).send({
            'message': 'Бронь на сеанс закрыта!'
        })
    }
    const reservedSlotsQuery = await SessionModel.getReservedSlots(session.id, 
        session.id_price_policy)
    const reservedSlots: SlotInterface[] = [...reservedSlotsQuery]

    const userSlots: SlotInterface[] = [...JSON.parse(`${req.query.slots}`)]
    
    let slotCheck = reservedSlots.filter(slot => userSlots.includes(slot))

    if (slotCheck.length > 0) {
        res.status(409).send({
            message: 'Одно из мест на сеанс уже забронировано. Пожалуйста, обновите страницу.'
        })
        return
    }


    
}