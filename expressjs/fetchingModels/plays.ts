import { Knex } from "knex";
import { KnexConnection } from "../knex/connections";
import { PlayDatabaseInstance } from "../dbModels/plays";
import { PlayBaseInterface, PlayInterface } from "../interfaces/plays";
import { InnerErrorInterface } from "../interfaces/errors";

class PlayFetchingModel {
    protected playDatabaseInstance

    constructor() {
        this.playDatabaseInstance = PlayDatabaseInstance
    }

    async getAll(): Promise<PlayInterface[] | InnerErrorInterface> {
        try {
            const query = await this.playDatabaseInstance.getAll({})
            return query
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске спектаклей!'
            }
        }
    }

    async getSinglePlay(idPlay: number) {
        try {
            const query: PlayInterface | undefined = await this.playDatabaseInstance.get({id: idPlay})
            if (!query) return <InnerErrorInterface>{
                code: 404,
                message: 'Спектакль не найден!'
            }
            return query
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске спектакля!'
            }
        }
        
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