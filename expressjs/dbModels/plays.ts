import { KnexConnection } from "../knex/connections";
import { Knex } from "knex";
import { DatabaseModel } from "./baseModel";
import { PlayBaseInterface, PlayInterface, PlayQueryInterface } from "../interfaces/plays";
import { images, plays, playsImages } from "./tables";

export interface PlayModel {
    getAll(payload: PlayQueryInterface): any
    get(payload: PlayQueryInterface): any
    insert(trx: Knex.Transaction, payload: PlayBaseInterface): any
    update(trx: Knex.Transaction, id: number, payload: { title?: string, description?: string }): any
    delete(trx: Knex.Transaction, id: number): any
    getAllWithPoster(payload: PlayQueryInterface): any
    getSingleWithPoster(payload: PlayQueryInterface): any
}


/**
 * Play 
 * id: number
 * title: string
 * description: string
 */
export class PlayDatabaseModel extends DatabaseModel implements PlayModel {
    constructor() {
        super(plays)
    }


    getAll(payload: PlayQueryInterface) {
        return KnexConnection(`${plays} as p`)
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
                KnexConnection.ref('*').withSchema('p'),
                KnexConnection.ref('filepath').withSchema('i').as('poster_filepath')
            )
            .where('pi.is_poster', true)
            .join(`${playsImages} as pi`, 'pi.id_play', 'p.id')
            .join(`${images} as i`, 'i.id', 'pi.id_image')
    }

    getSingleWithPoster(payload: PlayQueryInterface) {
        return this.getAllWithPoster(payload).first()
    }
}
