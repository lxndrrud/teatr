import { Knex } from "knex";
import { KnexConnection } from "../knex/connections";
import { PlayDatabaseInstance } from "../dbModels/plays";
import { PlayBaseInterface, PlayInterface } from "../interfaces/plays";

class PlayFetchingModel {
    protected playDatabaseInstance

    constructor() {
        this.playDatabaseInstance = PlayDatabaseInstance
    }

    getAll(payload: {
        id?: number,
        title?: string,
        description?: string
    }): Promise<PlayInterface[]> {
        return this.playDatabaseInstance.getAll(payload)
    }

    async getSinglePlay(payload: {
        id?: number,
        title?: string,
        description?: string
    }) {
        const query: PlayInterface | undefined = await this.playDatabaseInstance.get(payload)
        if (!query) return 404
        return query
    }

    async createPlay(payload: PlayBaseInterface) {
        const trx = await KnexConnection.transaction()
        try {
            const newPlay: PlayInterface = (await this.playDatabaseInstance.insert(trx, payload))[0]
            await trx.commit()
            return newPlay
        } catch (e) {
            await trx.rollback()
            return 500
        }
    }

    async updatePlay(idPlay: number, payload: PlayBaseInterface) {
        const trx = await KnexConnection.transaction()
        try {
            const query = await this.playDatabaseInstance.get({ id: idPlay})
            if (!query) {
                return 404
            }
            await trx.commit()
            return 200
        } catch (e) {
            await trx.rollback()
            return 500
        }
    }

    async deletePlay(idPlay: number) {
        const query = await this.playDatabaseInstance.get({ id: idPlay })
        if (!query) {
            return 404
        }
        const trx = await KnexConnection.transaction()
        try {
            await this.playDatabaseInstance.delete(trx, idPlay)
            return 200
        } catch (e) {
            return 500
        }
    }
}

export const PlayFetchingInstance = new PlayFetchingModel()