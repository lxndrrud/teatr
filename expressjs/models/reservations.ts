import { Knex } from "knex";
import { ReservationBaseInterface, ReservationDatabaseInterface, ReservationInterface } from "../interfaces/reservations";
import { ReservationsSlotsBaseInterface, ReservationsSlotsInterface, SlotInterface } from "../interfaces/slots";
import { KnexConnection } from "../knex/connections";

export const getSingleReservation = (idReservation: number) => {
    return KnexConnection<ReservationInterface>('reservations as r')
        .select(
            'r.*', 's.id as id_session', 'rec.id as id_record',
            's.timestamp as session_timestamp',
            'p.title as play_title'
        )
        .where('r.id', idReservation)
        .join('records as rec', 'rec.id', 'r.id_record')
        .join('sessions as s', 's.id', 'r.id_session')
        .join('plays as p', 'p.id', 's.id_play')
        .first()
}

export const getReservationForUpdate = (idReservation: number) => {
    return KnexConnection<ReservationDatabaseInterface>('reservations as r')
        .where('r.id', idReservation)
}

export const getReservedSlots = (idReservation: number) => {
    return KnexConnection<SlotInterface>('reservations_slots as rs')
        .select(
            'slots.id', 'slots.price', 
            'seats.number as seat_number', 'rows.number as row_number',
            'a.title as auditorium_title'
        )
        .where('rs.id_reservation', idReservation)
        .join('slots', 'slots.id', 'rs.id_slot')
        .join('seats', 'seats.id', 'slots.id_seat')
        .join('rows', 'rows.id', 'seats.id_row')
        .join('auditoriums as a', 'a.id', 'rows.id_auditorium')
}

export const createReservation = (trx: Knex.Transaction, payload: ReservationBaseInterface) => {
    return trx<ReservationDatabaseInterface>('reservations')
        .insert(payload)
        .returning('*')
}

export const updateReservation = (trx: Knex.Transaction, payload: ReservationDatabaseInterface) => {
    return trx('reservations')
        .where('reservations.id', payload.id)
        .update(payload)
}


export const createReservationsSlotsList = (trx: Knex.Transaction, payloadList: ReservationsSlotsBaseInterface[]) => {
    return trx<ReservationsSlotsInterface>('reservations_slots')
        .insert(payloadList)
        .returning('*')
}