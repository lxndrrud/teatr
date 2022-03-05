import { KnexConnection } from "../knex/connections"
import { Request, Response } from "express"
import { SlotInterface, ReservationInterface } from "../interfaces/reservations"
import * as ReservationModel from "../models/reservations"

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
        const slotsQuery = await ReservationModel.getReservationSlots(idReservation)
        const slots: SlotInterface[] = [...slotsQuery]
        const reservation: ReservationInterface = {...reservationQuery, slots}
        res.status(200).send(reservation)
    } catch (e) {
        console.log(e)
        res.status(500).end()
    }
}