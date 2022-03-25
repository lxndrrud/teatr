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
export class PlayDatabaseModel extends DatabaseModel {
    constructor(connection: Knex<any, unknown[]> = KnexConnection) {
        super(connection, plays)
    }


    getAll(payload: {
        id?: number,
        title?: string,
        description?: string
    }) {
        return this.connection(plays)
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

    insert(payload: {
        title: string,
        description: string
    }) {
        return this.connection(plays)
            .insert(payload)
            .returning('*')
    }

    update(id: number, payload: {
        title?: string,
        description?: string
    }) {
        return this.connection(plays)
            .update(payload)
            .where(`${plays}.id`, id)
    }

    delete(id: number) {
        return this.connection(plays)
            .where(`${plays}.id`, id)
            .del()
    }
}