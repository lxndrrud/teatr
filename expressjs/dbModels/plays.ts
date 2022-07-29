import { Knex } from "knex";
import { DatabaseModel } from "./baseModel";
import { PlayBaseInterface, PlayInterface, PlayQueryInterface } from "../interfaces/plays";
import { images, plays, playsImages, sessions } from "./tables";

export interface PlayModel {
    getAll(payload: PlayQueryInterface): Knex.QueryBuilder | any
    get(payload: PlayQueryInterface): Knex.QueryBuilder | any
    insert(trx: Knex.Transaction, payload: PlayBaseInterface): Knex.QueryBuilder | any
    insertAll(trx: Knex.Transaction, payload: PlayBaseInterface[]): Knex.QueryBuilder | any
    update(trx: Knex.Transaction, id: number, payload: { title?: string, description?: string }): Knex.QueryBuilder | any
    delete(trx: Knex.Transaction, id: number): Knex.QueryBuilder | any
    getAllWithPoster(payload: PlayQueryInterface): Knex.QueryBuilder | any
    getSingleWithPoster(payload: PlayQueryInterface): Knex.QueryBuilder | any
}


/**
 * Play 
 * id: number
 * title: string
 * description: string
 */
export class PlayDatabaseModel extends DatabaseModel implements PlayModel {
    constructor(connectionInstance: Knex<any, unknown[]>) {
        super(plays, connectionInstance)
    }


    getAll(payload: PlayQueryInterface) {
        return this.connection(`${plays} as p`)
            .where(builder => {
                if(payload.id) 
                    builder.andWhere('p.id', payload.id)
                if(payload.title) 
                    builder.andWhere('p.title', payload.title)
                if(payload.description) 
                    builder.andWhere('p.description', payload.description)
            })
    }

    get(payload: PlayQueryInterface) {
        return this.getAll(payload).first()
    }

    insert(trx: Knex.Transaction, payload: PlayBaseInterface) {
        return trx(plays)
            .insert(payload)
            .returning('*')
    }

    insertAll(trx: Knex.Transaction, payload: PlayBaseInterface[]) {
        return trx(plays)
            .insert(payload)
            .returning("id")
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

    getAllWithPoster(payload: PlayQueryInterface) {
        return this.getAll(payload)
            .select(
                this.connection.ref('*').withSchema('p'),
                this.connection.ref('filepath').withSchema('i').as('poster_filepath')
            )
            .where('pi.is_poster', true)
            .andWhere('s.is_locked', false)
            .join(`${playsImages} as pi`, 'pi.id_play', 'p.id')
            .join(`${images} as i`, 'i.id', 'pi.id_image')
            .join(`${sessions} as s`, 's.id_play', 'p.id')
    }

    getSingleWithPoster(payload: PlayQueryInterface) {
        return this.getAllWithPoster(payload).first()
    }
}
