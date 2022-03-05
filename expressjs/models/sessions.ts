import { Knex } from "knex";
import { KnexConnection } from "../knex/connections";
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface } 
    from "../interfaces/sessions"; 


export const getUnlockedSessions = () => {
    return KnexConnection('sessions as s')
        .select(
            's.id', 
            's.is_locked', 's.timestamp',
            's.id_play', 's.id_price_policy', 
            'a.title as auditorium_title', 
            'p.title as play_title'
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

export const getSingleSession = (id: number) => {
    return getUnlockedSessions().where('s.id', id).first()
}

export const postSession = (trx: Knex.Transaction, payload: SessionBaseInterface) => {
    return trx('sessions')
        .insert(payload)
        .returning('id')
}

export const updateSession = (trx: Knex.Transaction, id: number, payload: SessionBaseInterface) => {
    return trx('sessions').where({
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

export const getSessionsByPlay = (idPlay: number) => {
    return getUnlockedSessions()
        .andWhere('s.id_play', idPlay)
}

export const getRowsByPricePolicy = (idPricePolicy: number) => {
    return KnexConnection('rows as r')
        .select('r.id', 'r.number', 'r.title')
        .where('slots.id_price_policy', idPricePolicy)
        .join('seats', 'seats.id_row', 'r.id')
        .join('slots', 'slots.id_seat', 'seats.id')
        .distinct()
}

export const getSlotsByPricePolicy = (idPricePolicy: number) => {
    return KnexConnection('slots')
        .select('slots.id', 'rows.id as id_row', 'seats.number as seat_number', 
            'rows.number as row_number', 'slots.price'
        )
        .where('slots.id_price_policy', idPricePolicy)
        .join('seats', 'seats.id', 'slots.id_seat')
        .join('rows', 'rows.id', 'seats.id_row')
}

export const getReservedSlots = (idSession: number, idPricePolicy: number) => {
    return KnexConnection('slots')
        .select('slots.id', 'rows.id as id_row', 'seats.number as seat_number',
            'rows.number as row_number', 'slots.price'
        )
        .where('slots.id_price_policy', idPricePolicy)
        .andWhere('r.id_session', idSession)
        .join('seats', 'seats.id', 'slots.id_seat')
        .join('rows as rows', 'rows.id', 'seats.id_row')
        .join('reservations_slots as rr', 'rr.id_slot', 'slots.id')
        .join('reservations as r', 'r.id', 'rr.id_reservation')
}


export const getSessionFilterTimestamps = () => {
    return KnexConnection('sessions as s')
        .select('s.timestamp')
        .where('s.is_locked', false)
        .orderBy('s.timestamp', 'asc')
        .distinct()
}

export const getSessionFilterAuditoriums = () => {
    return KnexConnection('sessions as s')
        .select('a.title')
        .where('s.is_locked', false)
        .join('price_policies as pp', 'pp.id', 's.id_price_policy')
        .join('slots', 'slots.id_price_policy', 'pp.id')
        .join('seats', 'seats.id', 'slots.id_seat')
        .join('rows as r', 'r.id', 'seats.id_row')
        .join('auditoriums as a', 'a.id', 'r.id_auditorium')
        .distinct()
}

export const getSessionFilterPlays = () => {
    return KnexConnection('plays as p')
        .select('p.title')
        .where('s.is_locked', false)
        .join('sessions as s', 's.id_play', 'p.id')
        .distinct()
}

export const getFilteredSessions = (date: string, auditoriumTitle: string, playTitle: string) => {
    return getUnlockedSessions()
        .andWhere(builder => {
            if (date !== '')
                builder.andWhere('s.timestamp', 'like', `%${date}%`)
            if (auditoriumTitle !== '')
                builder.andWhere('a.title', auditoriumTitle)
            if (playTitle !== '')
                builder.andWhere('p.title', playTitle)
        })
}