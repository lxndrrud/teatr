import { Knex } from "knex";
import { PlayDatabaseModel } from "../dbModels/plays";
import { PlayInterface } from "../interfaces/plays";

export class PlayFetchingModel {
    static getAll(payload: {
        id?: number,
        title?: string,
        description?: string
    }): Promise<PlayInterface[]> {
        return new PlayDatabaseModel().getAll(payload)
    }

    static get(payload: {
        id?: number,
        title?: string,
        description?: string
    }): Promise<PlayInterface> {
        return new PlayDatabaseModel().get(payload)
    }

    static insert(trx: Knex.Transaction, payload: {
        title: string,
        description: string
    }): Promise<PlayInterface[]> {
        return new PlayDatabaseModel(trx).insert(payload)
    }

    static update(trx: Knex.Transaction, id: number, payload: {
        title?: string,
        description?: string
    }) {
        return new PlayDatabaseModel(trx).update(id, payload)
    }

    static delete(trx: Knex.Transaction, id: number) {
        return new PlayDatabaseModel(trx).delete(id)
    }
}