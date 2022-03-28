import { Knex } from "knex";
import { DatabaseModel } from "./baseModel";
import { KnexConnection } from "../knex/connections";
import { sessions } from "./tables";
import { SessionBaseInterface } from "../interfaces/sessions";


/**
 * id: number
 * is_locked: boolean
 * max_slots: number
 * id_play: number
 * id_price_policy: number
 * timestamp: timestamp(string)
 */
export class SessionDatabaseModel extends DatabaseModel {
    constructor(connection: Knex<any, unknown[]> = KnexConnection) {
        super(connection, sessions)
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

    insert(payload: SessionBaseInterface) {
        return this.connection(sessions)
            .insert(payload)
            .returning('*')
    }

    update(id: number, payload: {
        is_locked?: boolean,
        max_slots?: number,
        id_play?: number,
        id_price_policy?: number,
        timestamp?: string,
    }) {
        return this.connection(sessions)
        .update(payload)
        .where(`${sessions}.id`, id)
    }

    delete(id: number) {
        return this.connection(sessions)
            .where(`${sessions}.id`, id)
            .del()
    }
}