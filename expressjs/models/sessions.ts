import { Knex } from "knex";
import { KnexConnection } from "../knex/connections";
import { SlotInterface, SlotWithRowIdInterface } from "../interfaces/slots";
import { RowInterface } from "../interfaces/rows";
import { AuditoriumSessionFilterOption } from "../interfaces/auditoriums";
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface, SessionDatabaseInterface } 
    from "../interfaces/sessions"; 
import { PlaySessionFilterOptionInterface } from "../interfaces/plays";
import { TimestampSessionFilterOptionDatabaseInterface } from "../interfaces/timestamps";
import { getNextDayOfTimestamp } from "../utils/timestamp";

const unlockedSessions = () => {
    return KnexConnection<SessionInterface>('sessions as s')
        .select(
            KnexConnection.ref('id').withSchema('s'),
            KnexConnection.ref('is_locked').withSchema('s'), 
            KnexConnection.ref('timestamp').withSchema('s'),
            KnexConnection.ref('max_slots').withSchema('s'), 
            KnexConnection.ref('id_play').withSchema('s'), 
            KnexConnection.ref('id_price_policy').withSchema('s'),
            KnexConnection.ref('title').withSchema('a').as('auditorium_title'), 
            KnexConnection.ref('title').withSchema('p').as('play_title')
        )
        .join('plays as p', 'p.id', 's.id_play')
        .join('price_policies as pp', 'pp.id', 's.id_price_policy')
        .join('slots', 'slots.id_price_policy', 'pp.id')
        .join('seats', 'seats.id', 'slots.id_seat')
        .join('rows', 'rows.id', 'seats.id')
        .join('auditoriums as a', 'a.id', 'rows.id_auditorium')
        .where('s.is_locked', false)
        .distinct()
        .orderBy('s.timestamp', 'asc')
}

export const getUnlockedSessions = (): Promise<SessionInterface[]> => {
    return unlockedSessions()
}

export const getSingleSession = (id: number): Promise<SessionInterface | undefined> => {
   return unlockedSessions().where('s.id', id).first()
}

export const createSession = (trx: Knex.Transaction, payload: SessionBaseInterface) => {
    return trx<SessionDatabaseInterface>('sessions')
        .insert(payload)
        .returning('*')
}

export const updateSession = (trx: Knex.Transaction, id: number, payload: SessionBaseInterface) => {
    return trx<SessionDatabaseInterface>('sessions').where({
        id
    })
    .update(payload)
}

export const deleteSession = (trx: Knex.Transaction, id: number) => {
    return trx('sessions').where({
        id
    })
    .del()
}

export const getSessionsByPlay = (idPlay: number): Promise<SessionInterface[]> => {
    return unlockedSessions()
        .andWhere('s.id_play', idPlay)
}

export const getRowsByPricePolicy = (idPricePolicy: number): Promise<RowInterface[]> => {
    return KnexConnection<RowInterface>('rows as r')
        .select(
            KnexConnection.ref('id').withSchema('r'), 
            KnexConnection.ref('number').withSchema('r'), 
            KnexConnection.ref('title').withSchema('r')
        )
        .where('slots.id_price_policy', idPricePolicy)
        .join('seats', 'seats.id_row', 'r.id')
        .join('slots', 'slots.id_seat', 'seats.id')
        .distinct()
}

export const getSlotsByPricePolicy = (idPricePolicy: number): Promise<SlotWithRowIdInterface[]> => {
    return KnexConnection<SlotInterface>('slots')
        .select(
            KnexConnection.ref('id').withSchema('slots'), 
            KnexConnection.ref('id').withSchema('rows').as('id_row'),
            KnexConnection.ref('number').withSchema('seats').as('seat_number'), 
            KnexConnection.ref('number').withSchema('rows').as('row_number'), 
            KnexConnection.ref('price').withSchema('slots'),
            KnexConnection.ref('title').withSchema('a').as('auditorium_title')
        )
        .where('slots.id_price_policy', idPricePolicy)
        .join('seats', 'seats.id', 'slots.id_seat')
        .join('rows', 'rows.id', 'seats.id_row')
        .join('auditoriums as a', 'a.id', 'rows.id_auditorium')
}

export const getReservedSlots = (idSession: number, idPricePolicy: number): Promise<SlotInterface[]> => {
    return KnexConnection<SlotInterface>('slots')
        .select(
            KnexConnection.ref('id').withSchema('slots'), 
            KnexConnection.ref('number').withSchema('seats').as('seat_number'), 
            KnexConnection.ref('number').withSchema('rows').as('row_number'), 
            KnexConnection.ref('price').withSchema('slots'),
            KnexConnection.ref('title').withSchema('a').as('auditorium_title')
        )
        .where('slots.id_price_policy', idPricePolicy)
        .andWhere('r.id_session', idSession)
        .join('seats', 'seats.id', 'slots.id_seat')
        .join('rows as rows', 'rows.id', 'seats.id_row')
        .join('auditoriums as a', 'a.id', 'rows.id_auditorium')
        .join('reservations_slots as rr', 'rr.id_slot', 'slots.id')
        .join('reservations as r', 'r.id', 'rr.id_reservation')
}


export const getSessionFilterTimestamps = (): Promise<TimestampSessionFilterOptionDatabaseInterface[]> => {
    return KnexConnection<TimestampSessionFilterOptionDatabaseInterface>('sessions as s')
        .select(
            KnexConnection.ref('timestamp').withSchema('s')
        )
        .where('s.is_locked', false)
        .orderBy('s.timestamp', 'asc')
        .distinct()
}

export const getSessionFilterAuditoriums = (): Promise<AuditoriumSessionFilterOption[]> => {
    return KnexConnection<AuditoriumSessionFilterOption>('sessions as s')
        .select(
            KnexConnection.ref('title').withSchema('a')
        )
        .where('s.is_locked', false)
        .join('price_policies as pp', 'pp.id', 's.id_price_policy')
        .join('slots', 'slots.id_price_policy', 'pp.id')
        .join('seats', 'seats.id', 'slots.id_seat')
        .join('rows as r', 'r.id', 'seats.id_row')
        .join('auditoriums as a', 'a.id', 'r.id_auditorium')
        .distinct()
}

export const getSessionFilterPlays = (): Promise<PlaySessionFilterOptionInterface[]> => {
    return KnexConnection<PlaySessionFilterOptionInterface>('plays as p')
        .select(
            KnexConnection.ref('title').withSchema('p')
        )
        .where('s.is_locked', false)
        .join('sessions as s', 's.id_play', 'p.id')
        .distinct()
}

export const getFilteredSessions = (userQueryPayload: SessionFilterQueryInterface): Promise<SessionInterface[]> => {
    return unlockedSessions()
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