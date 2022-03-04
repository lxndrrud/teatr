import { Knex } from "knex";
import { KnexConnection } from "../knex/connections";
import { PlayBaseInterface, PlayInterface } from "../interfaces/plays";


export const getPlays = () => {
    return KnexConnection<PlayInterface>('plays')
}

export const getSinglePlay = (id: number) => {
    return KnexConnection<PlayInterface>('plays')
        .where({
            id
        })
        .first()
}

export const postPlay = (trx: Knex.Transaction, payload: PlayBaseInterface) => {
    return trx('plays').insert(payload).returning('id')
}

export const updatePlay = (trx: Knex.Transaction, id: number, payload: PlayBaseInterface) => {
    return trx('plays').where({
        id
    })
    .update(payload)
}

export const deletePlay = (trx: Knex.Transaction, id: number) => {
    return trx('plays').where({
        id
    }).del()
}