import { Knex } from "knex";
import { DatabaseModel } from "./baseModel";
import { KnexConnection } from "../knex/connections";
import { sessions, plays, pricePolicies, slots, seats, rows, auditoriums, reservationsSlots, reservations, playsImages, images } from "./tables";
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface, SessionDatabaseInterface } 
    from "../interfaces/sessions";
import { getNextDayOfTimestamp } from "../utils/timestamp";



/**
 * id: number
 * is_locked: boolean
 * max_slots: number
 * id_play: number
 * id_price_policy: number
 * timestamp: timestamp(string)
 */
class SessionDatabaseModel extends DatabaseModel {
    constructor() {
        super(sessions)
    }

    getAll(payload: {
        id?: number,
        is_locked?: boolean,
        max_slots?: number,
        id_play?: number,
        id_price_policy?: number,
        timestamp?: string,
    }) {
        return KnexConnection(sessions)
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
        return KnexConnection(`${sessions} as s`)
            .select(
                KnexConnection.ref('id').withSchema('s'),
                KnexConnection.ref('is_locked').withSchema('s'), 
                KnexConnection.ref('timestamp').withSchema('s'),
                KnexConnection.ref('max_slots').withSchema('s'), 
                KnexConnection.ref('id_play').withSchema('s'), 
                KnexConnection.ref('id_price_policy').withSchema('s'),
                KnexConnection.ref('title').withSchema('a').as('auditorium_title'), 
                KnexConnection.ref('title').withSchema('p').as('play_title'),
                KnexConnection.ref('filepath').withSchema('i').as('poster_filepath'),
            )
            .join(`${plays} as p`, 'p.id', 's.id_play')
            .join(`${playsImages} as pi`, 'pi.id_play', 'p.id')
            .join(`${images} as i`, 'i.id', 'pi.id_image')
            .join(`${pricePolicies} as pp`, 'pp.id', 's.id_price_policy')
            .join(slots, `${slots}.id_price_policy`, 'pp.id')
            .join(seats, `${seats}.id`, `${slots}.id_seat`)
            .join(rows, `${rows}.id`, `${seats}.id`)
            .join(`${auditoriums} as a`, 'a.id', `${rows}.id_auditorium`)
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
        return KnexConnection(`${rows} as r`)
            .select(
                KnexConnection.ref('id').withSchema('r'), 
                KnexConnection.ref('number').withSchema('r'), 
                KnexConnection.ref('title').withSchema('r')
            )
            .where(`${slots}.id_price_policy`, idPricePolicy)
            .join(seats, `${seats}.id_row`, 'r.id')
            .join(slots, `${slots}.id_seat`, `${seats}.id`)
            .distinct()
    }
    
    getSlotsByPricePolicy(idPricePolicy: number) {
        return KnexConnection(slots)
            .select(
                KnexConnection.ref('id').withSchema(slots), 
                KnexConnection.ref('id').withSchema(rows).as('id_row'),
                KnexConnection.ref('number').withSchema(seats).as('seat_number'), 
                KnexConnection.ref('number').withSchema(rows).as('row_number'), 
                KnexConnection.ref('price').withSchema(slots),
                KnexConnection.ref('title').withSchema('a').as('auditorium_title'),
                KnexConnection.ref('title').withSchema(rows).as('row_title')
            )
            .where(`${slots}.id_price_policy`, idPricePolicy)
            .join(seats, `${seats}.id`, `${slots}.id_seat`)
            .join(rows, `${rows}.id`, `${seats}.id_row`)
            .join(`${auditoriums} as a`, 'a.id', `${rows}.id_auditorium`)
    }
    
    getReservedSlots(idSession: number, idPricePolicy: number){
        return KnexConnection(slots)
            .select(
                KnexConnection.ref('id').withSchema(slots), 
                KnexConnection.ref('number').withSchema(seats).as('seat_number'), 
                KnexConnection.ref('number').withSchema(rows).as('row_number'), 
                KnexConnection.ref('price').withSchema(slots),
                KnexConnection.ref('title').withSchema('a').as('auditorium_title'),
                KnexConnection.ref('title').withSchema(rows).as('row_title')
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
        return KnexConnection(`${sessions} as s`)
            .select(
                KnexConnection.ref('timestamp').withSchema('s')
            )
            .where('s.is_locked', false)
            .orderBy('s.timestamp', 'asc')
            .distinct()
    }
    
    getSessionFilterAuditoriums() {
        return KnexConnection(`${sessions} as s`)
            .select(
                KnexConnection.ref('title').withSchema('a')
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
        return KnexConnection(`${plays} as p`)
            .select(
                KnexConnection.ref('title').withSchema('p')
            )
            .where('s.is_locked', false)
            .join(`${sessions} as s`, 's.id_play', 'p.id')
            .distinct()
    }
    

    getFilteredSessions(userQueryPayload: SessionFilterQueryInterface) {
        return this.getUnlockedSessions()
            .andWhere(builder => {
                if (userQueryPayload.date !== '') {
                    builder.andWhere(innerBuilder => {
                        innerBuilder.andWhere('s.timestamp', '>=', `${userQueryPayload.date}T00:00:00`)
                        innerBuilder.andWhere('s.timestamp', '<', getNextDayOfTimestamp(`${userQueryPayload.date}`))
                    })
                }
                if (userQueryPayload.auditorium_title !== '')
                    builder.andWhere('a.title', userQueryPayload.auditorium_title)
                if (userQueryPayload.play_title !== '')
                    builder.andWhere('p.title', userQueryPayload.play_title)
            })
    }
}

export const SessionDatabaseInstance = new SessionDatabaseModel()