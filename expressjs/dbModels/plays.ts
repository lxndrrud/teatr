import { KnexConnection } from "../knex/connections";
import { Knex } from "knex";
import { DatabaseModel } from "./baseModel";
import { plays } from "./tables";

/**
 * Play 
 * id: number
 * title: string
 * description: string
 */
class PlayDatabaseModel extends DatabaseModel {
    constructor() {
        super(plays)
    }


    getAll(payload: {
        id?: number,
        title?: string,
        description?: string
    }) {
        return KnexConnection(plays)
            .where(builder => {
                if(payload.id) 
                    builder.andWhere(`${plays}.id`, payload.id)
                if(payload.title) 
                    builder.andWhere(`${plays}.title`, payload.title)
                if(payload.description) 
                    builder.andWhere(`${plays}.description`, payload.description)
            })
    }

    get(payload: {
        id?: number,
        title?: string,
        description?: string
    }) {
        return this.getAll(payload).first()
    }

    insert(trx: Knex.Transaction, payload: {
        title: string,
        description: string
    }) {
        return trx(plays)
            .insert(payload)
            .returning('*')
    }

    update(trx: Knex.Transaction, id: number, payload: {
        title?: string,
        description?: string
    }) {
        return trx(plays)
            .update(payload)
            .where(`${plays}.id`, id)
    }

    delete(trx: Knex.Transaction, id: number) {
        return trx(plays)
            .where(`${plays}.id`, id)
            .del()
    }
}

export const PlayDatabaseInstance = new PlayDatabaseModel()