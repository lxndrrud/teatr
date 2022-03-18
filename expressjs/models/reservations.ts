import { Knex } from "knex";
import { ReservationBaseInterface, 
    ReservationDatabaseInterface, 
    ReservationInterface, 
    ReservationWithoutSlotsInterface } from "../interfaces/reservations";
import { ReservationsSlotsBaseInterface, ReservationsSlotsInterface, 
    SlotInterface } from "../interfaces/slots";
import { KnexConnection } from "../knex/connections";

export const getSingleReservation = (idReservation: number): Promise<ReservationWithoutSlotsInterface | undefined> => {
    return KnexConnection<ReservationWithoutSlotsInterface>('reservations as r')
        .select(
            KnexConnection.ref('*').withSchema('r'), 
            KnexConnection.ref('id').withSchema('s').as('id_session'), 
            KnexConnection.ref('id').withSchema('u').as('id_user'),
            KnexConnection.ref('timestamp').withSchema('s').as('session_timestamp'),
            KnexConnection.ref('title').withSchema('p').as('play_title')
        )
        .where('r.id', idReservation)
        .join('users as u', 'u.id', 'r.id_user')
        .join('sessions as s', 's.id', 'r.id_session')
        .join('plays as p', 'p.id', 's.id_play')
        .first()
}

export const getReservationForDelete = (code: string, idSession: number): Promise<ReservationWithoutSlotsInterface | undefined> => {
    return KnexConnection('reservations')
        .select(
            KnexConnection.ref('*').withSchema('r'), 
            KnexConnection.ref('id').withSchema('s').as('id_session'), 
            KnexConnection.ref('id').withSchema('u').as('id_user'),
            KnexConnection.ref('timestamp').withSchema('s').as('session_timestamp'),
            KnexConnection.ref('title').withSchema('p').as('play_title')
        )
        .where('s.id', idSession)
        .andWhere('r.code', code)
        .join('users as u', 'u.id', 'u.id_user')
        .join('sessions as s', 's.id', 'r.id_session')
        .join('plays as p', 'p.id', 's.id_play')
        .first()
}

export const getReservationForUpdate = (idReservation: number) => {
    return KnexConnection<ReservationDatabaseInterface>('reservations as r')
        .where('id', idReservation)
}

export const getReservedSlots = (idReservation: number): Promise<SlotInterface[]> => {
    return KnexConnection<SlotInterface>('reservations_slots as rs')
        .select(
            KnexConnection.ref('id').withSchema('slots'),
            KnexConnection.ref('price').withSchema('slots'),
            KnexConnection.ref('number').withSchema('seats').as('seat_number'),
            KnexConnection('number').withSchema('rows').as('row_number'),
            KnexConnection('title').withSchema('a').as('auditorium_title')
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
    return trx<ReservationDatabaseInterface>('reservations')
        .where('id', payload.id)
        .update({
            //'code': payload.code,
            'is_paid': payload.is_paid,
            'is_confirmed': payload.is_confirmed,
            'confirmation_code': payload.confirmation_code,
            'created_at': payload.created_at,
            'id_session': payload.id_session,
            'id_user': payload.id_user,
        })
}


export const createReservationsSlotsList = (trx: Knex.Transaction, payloadList: ReservationsSlotsBaseInterface[]) => {
    return trx<ReservationsSlotsInterface>('reservations_slots')
        .insert(payloadList)
        .returning('*')
}

export const deleteReservation = (trx: Knex.Transaction, idReservation: number) => {
    return trx('reservations')
        .where({
            id: idReservation
        })
        .del()
}


export const deleteReservationsSlots = (trx: Knex.Transaction, idReservation: number) => {
    return trx('reservations_slots')
        .where('id_reservation', idReservation)
        .del()
}