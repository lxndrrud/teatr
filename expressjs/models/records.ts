import { Knex } from "knex"
import { KnexConnection } from "../knex/connections"
import { RecordBaseInterface, RecordInterface } from "../interfaces/records"

export const getRecordByEmail = (email: string) => {
    return KnexConnection<RecordInterface>('records as r')
        .where('r.email', email)
        .first()
}

export const createRecord = (trx: Knex.Transaction, payload: RecordBaseInterface) => {
    return trx<RecordInterface>('records')
        .insert(payload)
        .returning('*')
}