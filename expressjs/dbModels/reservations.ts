import { KnexConnection } from "../knex/connections";
import { Knex } from "knex";
import { reservations, rows, seats, slots, auditoriums,
    users, plays, sessions, pricePolicies, reservationsSlots } from "./tables";
import { DatabaseModel } from "./baseModel";
import { ReservationBaseInterface, ReservationDatabaseInterface,
    ReservationWithoutSlotsInterface, ReservationFilterQueryInterface } from "../interfaces/reservations"
import { ReservationsSlotsBaseInterface } from "../interfaces/slots"
import { getNextDayOfTimestamp } from "../utils/timestamp"

/**
 * id
 * created_at
 * is_paid
 * is_confirmed
 * confirmation_code
 * id_session
 * id_user
 */
class ReservationDatabaseModel extends DatabaseModel {
    constructor() {
        super(reservations)
    }

    getAll(payload: {
        id?: number
        created_at?: string 
        is_paid?: boolean
        is_confirmed?: boolean
        confirmation_code?: string
        id_session?: number
        id_user?: number
    }) {
        return KnexConnection(reservations)
            .where(builder => {
                if (payload.id)
                    builder.andWhere(`${reservations}.id`, payload.id)
                if (payload.created_at)
                    builder.andWhere(`${reservations}.created_at`, payload.created_at)
                if (payload.is_paid)
                    builder.andWhere(`${reservations}.is_paid`, payload.is_paid)
                if (payload.is_confirmed)
                    builder.andWhere(`${reservations}.is_confirmed`, payload.is_confirmed)
                if (payload.confirmation_code)
                    builder.andWhere(`${reservations}.confirmation_code`, payload.confirmation_code)
                if (payload.id_session)
                    builder.andWhere(`${reservations}.id_session`, payload.id_session)
                if (payload.id_user)
                    builder.andWhere(`${reservations}.id_user`, payload.id_user)
            })
    }

    get(payload: {
        id?: number
        created_at?: string 
        is_paid?: boolean
        is_confirmed?: boolean
        confirmation_code?: string
        id_session?: number
        id_user?: number
    }) {
        return this.getAll(payload).first()
    }


    insert(trx: Knex.Transaction<any, any[]>, payload: ReservationBaseInterface) {
        return trx(reservations)
            .insert(payload)
            .returning('*')
    }

    update(trx: Knex.Transaction<any, any[]>, id: number, payload: {
        id?: number
        created_at?: string 
        is_paid?: boolean
        is_confirmed?: boolean
        confirmation_code?: string
        id_session?: number
        id_user?: number
    }) {
        return trx(reservations)
            .update(payload)
            .where(`${reservations}.id`, id)
    }

    delete(trx: Knex.Transaction<any, any[]>, id: number) {
        return trx(reservations)
            .where(`${reservations}.id`, id)
            .del()
    }

    /**
     * Promise<ReservationWithoutSlotsInterface>
     */
    getAllFullInfo() {
        return KnexConnection(`${reservations} as r`)
        .select(
            KnexConnection.ref('*').withSchema('r'), 
            KnexConnection.ref('id').withSchema('s').as('id_session'), 
            KnexConnection.ref('id').withSchema('u').as('id_user'),
            KnexConnection.ref('timestamp').withSchema('s').as('session_timestamp'),
            KnexConnection.ref('title').withSchema('p').as('play_title'),
            KnexConnection.ref('title').withSchema('a').as('auditorium_title'),
            KnexConnection.ref('is_locked').withSchema('s').as('session_is_locked')
        )
        .join(`${users} as u`, 'u.id', 'r.id_user')
        .join(`${sessions} as s`, 's.id', 'r.id_session')
        .join(`${plays} as p`, 'p.id', 's.id_play')
        .join(`${pricePolicies} as pp`, 'pp.id', 's.id_price_policy')
        .join(slots, `${slots}.id_price_policy`, 'pp.id')
        .join(seats, `${seats}.id`, `${slots}.id_seat`)
        .join(rows, `${rows}.id`, `${seats}.id_row`)
        .join(`${auditoriums} as a`, 'a.id', `${rows}.id_auditorium`)
        .distinct()
        .orderBy("r.created_at", "desc")
    }

    getSingleFullInfo(idReservation: number) {
        return this.getAllFullInfo()
            .where('r.id', idReservation)
            .first()
    }

    /**
     * Promise<ReservationWithoutSlotsInterface[]>
     */
    getUserReservations (idUser: number) {
        return this.getAllFullInfo()
            .where('u.id', idUser)
            .andWhere('s.is_locked', false)
    }

    /**
     * Promise<SlotInterface[]>
     */
    getReservedSlots (idReservation: number)  {
        return KnexConnection(`${reservationsSlots} as rs`)
            .select(
                KnexConnection.ref('id').withSchema(slots),
                KnexConnection.ref('price').withSchema(slots),
                KnexConnection.ref('number').withSchema(seats).as('seat_number'),
                KnexConnection.ref('number').withSchema(rows).as('row_number'),
                KnexConnection.ref('title').withSchema('a').as('auditorium_title'),
                KnexConnection.ref('title').withSchema(rows).as('row_title')
            )
            .where('rs.id_reservation', idReservation)
            .join(slots, `${slots}.id`, 'rs.id_slot')
            .join(seats, `${seats}.id`, `${slots}.id_seat`)
            .join(rows, `${rows}.id`, `${seats}.id_row`)
            .join(`${auditoriums} as a`, 'a.id', `${rows}.id_auditorium`)
    }

    /**
     * Promise<ReservationsSlotsInterface>
     */
    insertReservationsSlotsList(trx: Knex.Transaction, payloadList: ReservationsSlotsBaseInterface[]){
        return trx(reservationsSlots)
            .insert(payloadList)
            .returning('*')
    }

    deleteReservationsSlots (trx: Knex.Transaction, idReservation: number) {
        return trx(reservationsSlots)
            .where(`${reservationsSlots}.id_reservation`, idReservation)
            .del()
    }


    getTimestampsOptionsForReservationFilter() {
        return KnexConnection(`${reservations} as r`)
            .select(
                KnexConnection.ref('timestamp').withSchema('s').as('timestamp')
            )
            .where('s.is_locked', false)
            .join(`${sessions} as s`, 's.id', 'r.id_session')
            .orderBy('s.timestamp', 'asc')
            .distinct()
    }

    getAuditoriumsOptionsForReservationFilter() {
        return KnexConnection(`${reservations} as r`)
            .select(
                KnexConnection.ref('title').withSchema('a')
            )
            .where('s.is_locked', false)
            .join(`${sessions} as s`, 's.id', 'r.id_session')
            .join(`${pricePolicies} as pp`, 'pp.id', 's.id_price_policy')
            .join(slots, `${slots}.id_price_policy`, 'pp.id')
            .join(seats, `${seats}.id`, `${slots}.id_seat`)
            .join(rows, `${rows}.id`, `${seats}.id_row`)
            .join(`${auditoriums} as a`, 'a.id', `${rows}.id_auditorium`)
            .distinct()
    }

    getPlaysOptionsForReservationFilter() {
        return KnexConnection(`${reservations} as r`)
            .select(
                KnexConnection.ref('title').withSchema('p')
            )
            .where('s.is_locked', false)
            .join(`${sessions} as s`, 's.id', 'r.id_session')
            .join(`${plays} as p`, 'p.id', 's.id_play')
            .distinct()
    }

    getFilteredReservations(userQuery: ReservationFilterQueryInterface) {
        return this.getAllFullInfo()
            .andWhere(builder => {
                if (userQuery.date !== undefined && userQuery.date !== 'undefined') {
                    builder.andWhere(innerBuilder => {
                        innerBuilder
                            .andWhere('s.timestamp', '>=', `${userQuery.date}T00:00:00`)
                        innerBuilder
                            .andWhere('s.timestamp', '<', getNextDayOfTimestamp(`${userQuery.date}`))
                    })
                }
                if (userQuery.auditorium_title !== undefined && userQuery.auditorium_title !== 'undefined') {
                    builder.andWhere('a.title', userQuery.auditorium_title)
                }
                if (userQuery.play_title !== undefined && userQuery.play_title !== 'undefined') {
                    builder.andWhere('p.title', userQuery.play_title)
                }
                if (userQuery.is_locked !== undefined && userQuery.is_locked !== 'undefined') {
                    if (userQuery.is_locked === 'true') {
                        builder.andWhere('s.is_locked', true)
                    }
                    else {
                        builder.andWhere('s.is_locked', false)
                    }
                }
                if (userQuery.id_reservation !== undefined && userQuery.id_reservation !== 'undefined') {
                    builder.andWhere('r.id', parseInt(userQuery.id_reservation))
                }
            })
    }

    getFilteredReservationsForUser(userQuery: ReservationFilterQueryInterface, idUser: number) {
        return this.getFilteredReservations(userQuery)
            .andWhere('r.id_user', idUser)
    }


}

export const ReservationDatabaseInstance = new ReservationDatabaseModel()