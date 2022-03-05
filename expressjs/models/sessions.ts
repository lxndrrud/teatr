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
        .orderBy('s.timestamp')
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

