import { Knex } from "knex";
import { DatabaseModel } from "./baseModel";
import { sessions, plays, pricePolicies, slots, seats, rows, auditoriums, reservationsSlots, reservations, playsImages, images } from "./tables";
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface, SessionDatabaseInterface } 
    from "../interfaces/sessions";
import { TimestampHelper } from "../utils/timestamp";



export interface SessionModel {
    getAll(payload: {
        id?: number,
        is_locked?: boolean,
        max_slots?: number,
        id_play?: number,
        id_price_policy?: number,
        timestamp?: string,
    }): Knex.QueryBuilder | any

    get(payload: {
        id?: number,
        is_locked?: boolean,
        max_slots?: number,
        id_play?: number,
        id_price_policy?: number,
        timestamp?: string,
    }): Knex.QueryBuilder | any

    insert(trx: Knex.Transaction, payload: SessionBaseInterface): Knex.QueryBuilder | any

    insertAll(trx: Knex.Transaction, payload: SessionBaseInterface[]): Knex.QueryBuilder | any

    update(trx: Knex.Transaction, id: number, payload: {
        is_locked?: boolean,
        max_slots?: number,
        id_play?: number,
        id_price_policy?: number,
        timestamp?: string,
    }): Knex.QueryBuilder | any

    delete(trx: Knex.Transaction, id: number): Knex.QueryBuilder | any
    
    getUnlockedSessions(): Knex.QueryBuilder | any

    getSingleUnlockedSession(idSession: number): Knex.QueryBuilder | any

    getSessionsByPlay(idPlay: number): Knex.QueryBuilder | any

    getRowsByPricePolicy(idPricePolicy: number): Knex.QueryBuilder | any

    getSlotsByPricePolicy(idPricePolicy: number): Knex.QueryBuilder | any

    getReservedSlots(idSession: number, idPricePolicy: number): Knex.QueryBuilder | any

    getSessionFilterTimestamps(): Knex.QueryBuilder | any

    getSessionFilterAuditoriums(): Knex.QueryBuilder | any

    getSessionFilterPlays(): Knex.QueryBuilder | any

    getFilteredSessions(userQueryPayload: SessionFilterQueryInterface): Knex.QueryBuilder | any
}

/**
 * id: number
 * is_locked: boolean
 * max_slots: number
 * id_play: number
 * id_price_policy: number
 * timestamp: timestamp(string)
 */
export class SessionDatabaseModel extends DatabaseModel implements SessionModel {
    private timestampHelper

    constructor(
        connectionInstance: Knex<any, unknown[]>,
        timestampHelperInstance: TimestampHelper
    ) {
        super(sessions, connectionInstance)
        this.timestampHelper = timestampHelperInstance
    }

    getAll(payload: {
        id?: number,
        is_locked?: boolean,
        max_slots?: number,
        id_play?: number,
        id_price_policy?: number,
        timestamp?: string,
    }) {
        return this.connection(sessions)
            .where(builder => {
                if (payload.id)
                    builder.andWhere(`${sessions}.id`, payload.id)
                if (payload.is_locked)
                    builder.andWhere(`${sessions}.is_locked`, payload.is_locked)
                if (payload.max_slots)
                    builder.andWhere(`${sessions}.max_slots`, payload.max_slots)
                if (payload.id_play)
                    builder.andWhere(`${sessions}.id_play`, payload.id_play)
                if (payload.id_price_policy)
                    builder.andWhere(`${sessions}.id_price_policy`, payload.id_price_policy)
                if (payload.timestamp)
                    builder.andWhere(`${sessions}.timestamp`, payload.timestamp)
            })
    }

    get(payload: {
        id?: number,
        is_locked?: boolean,
        max_slots?: number,
        id_play?: number,
        id_price_policy?: number,
        timestamp?: string,
    }) {
        return this.getAll(payload).first()
    }

    insert(trx: Knex.Transaction, payload: SessionBaseInterface) {
        return trx(sessions)
            .insert(payload)
            .returning('*')
    }

    insertAll(trx: Knex.Transaction, payload: SessionBaseInterface[]) {
        return trx(sessions)
            .insert(payload)
            .returning("id")
    }

    update(trx: Knex.Transaction, id: number, payload: {
        is_locked?: boolean,
        max_slots?: number,
        id_play?: number,
        id_price_policy?: number,
        timestamp?: string,
    }) {
        return trx(sessions)
        .update(payload)
        .where(`${sessions}.id`, id)
    }

    delete(trx: Knex.Transaction, id: number) {
        return trx(sessions)
            .where(`${sessions}.id`, id)
            .del()
    }

    getUnlockedSessions() {
        return this.connection(`${sessions} as s`)
            .select(
                this.connection.ref('id').withSchema('s'),
                this.connection.ref('is_locked').withSchema('s'), 
                this.connection.ref('timestamp').withSchema('s'),
                this.connection.ref('max_slots').withSchema('s'), 
                this.connection.ref('id_play').withSchema('s'), 
                this.connection.ref('id_price_policy').withSchema('s'),
                this.connection.ref('title').withSchema('a').as('auditorium_title'), 
                this.connection.ref('title').withSchema('p').as('play_title'),
                this.connection.ref('filepath').withSchema('i').as('poster_filepath'),
            )
            .join(`${plays} as p`, 'p.id', 's.id_play')
            .join(`${pricePolicies} as pp`, 'pp.id', 's.id_price_policy')
            .join(slots, `${slots}.id_price_policy`, 'pp.id')
            .join(seats, `${seats}.id`, `${slots}.id_seat`)
            .join(rows, `${rows}.id`, `${seats}.id_row`)
            .join(`${auditoriums} as a`, 'a.id', `${rows}.id_auditorium`)
            .join(`${playsImages} as pi`, 'pi.id_play', 'p.id')
            .join(`${images} as i`, 'i.id', 'pi.id_image')
            .where('s.is_locked', false)
            .andWhere('pi.is_poster', true)
            .distinct()
            .orderBy('s.timestamp', 'asc')
    }

    getSingleUnlockedSession(idSession: number) {
        return this.getUnlockedSessions()
            .where('s.id', idSession)
            .first()
    }

    getSessionsByPlay(idPlay: number)  {
        return this.getUnlockedSessions()
            .andWhere('s.id_play', idPlay)
    }

    getRowsByPricePolicy(idPricePolicy: number) {
        return this.connection(`${rows} as r`)
            .select(
                this.connection.ref('id').withSchema('r'), 
                this.connection.ref('number').withSchema('r'), 
                this.connection.ref('title').withSchema('r')
            )
            .where(`${slots}.id_price_policy`, idPricePolicy)
            .join(seats, `${seats}.id_row`, 'r.id')
            .join(slots, `${slots}.id_seat`, `${seats}.id`)
            .distinct()
    }
    
    getSlotsByPricePolicy(idPricePolicy: number) {
        return this.connection(slots)
            .select(
                this.connection.ref('id').withSchema(slots), 
                this.connection.ref('id').withSchema(rows).as('id_row'),
                this.connection.ref('number').withSchema(seats).as('seat_number'), 
                this.connection.ref('number').withSchema(rows).as('row_number'), 
                this.connection.ref('price').withSchema(slots),
                this.connection.ref('title').withSchema('a').as('auditorium_title'),
                this.connection.ref('title').withSchema(rows).as('row_title')
            )
            .where(`${slots}.id_price_policy`, idPricePolicy)
            .join(seats, `${seats}.id`, `${slots}.id_seat`)
            .join(rows, `${rows}.id`, `${seats}.id_row`)
            .join(`${auditoriums} as a`, 'a.id', `${rows}.id_auditorium`)
    }
    
    getReservedSlots(idSession: number, idPricePolicy: number){
        return this.connection(slots)
            .select(
                this.connection.ref('id').withSchema(slots), 
                this.connection.ref('number').withSchema(seats).as('seat_number'), 
                this.connection.ref('number').withSchema(rows).as('row_number'), 
                this.connection.ref('price').withSchema(slots),
                this.connection.ref('title').withSchema('a').as('auditorium_title'),
                this.connection.ref('title').withSchema(rows).as('row_title')
            )
            .where(`${slots}.id_price_policy`, idPricePolicy)
            .andWhere('r.id_session', idSession)
            .join(seats, `${seats}.id`, `${slots}.id_seat`)
            .join(rows, `${rows}.id`, `${seats}.id_row`)
            .join(`${auditoriums} as a`, 'a.id', `${rows}.id_auditorium`)
            .join(`${reservationsSlots} as rs`, 'rs.id_slot', `${slots}.id`)
            .join(`${reservations} as r`, 'r.id', 'rs.id_reservation')
    }
    
    
    getSessionFilterTimestamps() {
        return this.connection(`${sessions} as s`)
            .select(
                this.connection.ref('timestamp').withSchema('s')
            )
            .where('s.is_locked', false)
            .orderBy('s.timestamp', 'asc')
            .distinct()
    }
    
    getSessionFilterAuditoriums() {
        return this.connection(`${sessions} as s`)
            .select(
                this.connection.ref('title').withSchema('a')
            )
            .where('s.is_locked', false)
            .join(`${pricePolicies} as pp`, 'pp.id', 's.id_price_policy')
            .join(slots, `${slots}.id_price_policy`, 'pp.id')
            .join(seats, `${seats}.id`, `${slots}.id_seat`)
            .join(`${rows} as r`, 'r.id', `${seats}.id_row`)
            .join(`${auditoriums} as a`, 'a.id', 'r.id_auditorium')
            .distinct()
    }
    
    getSessionFilterPlays() {
        return this.connection(`${plays} as p`)
            .select(
                this.connection.ref('title').withSchema('p')
            )
            .where('s.is_locked', false)
            .join(`${sessions} as s`, 's.id_play', 'p.id')
            .distinct()
    }
    

    getFilteredSessions(userQueryPayload: SessionFilterQueryInterface) {
        return this.getUnlockedSessions()
            .andWhere(builder => {
                if (userQueryPayload.dateFrom
                        && userQueryPayload.dateFrom !== 'undefined') {
                    builder.andWhere(innerBuilder => {
                        innerBuilder.andWhere('s.timestamp', '>=', `${userQueryPayload.dateFrom}T00:00:00`)
                        innerBuilder.andWhere('s.timestamp', '<', 
                            this.timestampHelper.getNextDayOfTimestamp(`${userQueryPayload.dateFrom}`))
                    })
                }
                if (userQueryPayload.auditorium_title  
                        && userQueryPayload.auditorium_title !== 'undefined')
                    builder.andWhere('a.title', userQueryPayload.auditorium_title)
                if (userQueryPayload.play_title 
                        && userQueryPayload.play_title !== 'undefined')
                    builder.andWhere('p.title', userQueryPayload.play_title)
            })
    }
}
