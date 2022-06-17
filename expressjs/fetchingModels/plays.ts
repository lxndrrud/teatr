import { Knex } from "knex";
import { KnexConnection } from "../knex/connections";
import { PlayModel } from "../dbModels/plays";
import { PlayBaseInterface, PlayInterface, PlayWithPosterInterface } from "../interfaces/plays";
import { InnerErrorInterface } from "../interfaces/errors";
import { UploadedFile } from "express-fileupload";
import { UserRequestOption } from "../interfaces/users";
import fs from "fs"
import csvParser from "csv-parser";
import { resolve } from "path";

export interface PlayService {
    getAll(): Promise<PlayWithPosterInterface[] | InnerErrorInterface>
    getSinglePlay(idPlay: number): Promise<InnerErrorInterface | PlayWithPosterInterface>
    createPlay(payload: PlayBaseInterface): Promise<PlayInterface | InnerErrorInterface>
    updatePlay(idPlay: number, payload: PlayBaseInterface): Promise<InnerErrorInterface | undefined>
    deletePlay(idPlay: number): Promise<InnerErrorInterface | undefined>
    createPlaysCSV(file: UploadedFile): 
        Promise<InnerErrorInterface | void>
}

export class PlayFetchingModel implements PlayService {
    protected playDatabaseInstance

    constructor(playModelInstance: PlayModel) {
        this.playDatabaseInstance = playModelInstance
    }

    async getAll() {
        try {
            const query: PlayWithPosterInterface[] = await this.playDatabaseInstance.getAllWithPoster({})
            return query
        } catch (e) {
            console.error(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске спектаклей!'
            }
        }
    }

    async getSinglePlay(idPlay: number) {
        try {
            const query: PlayWithPosterInterface = await this.playDatabaseInstance.getSingleWithPoster({id: idPlay})
            if (!query) return <InnerErrorInterface>{
                code: 404,
                message: 'Спектакль не найден!'
            }
            return query
        } catch (e) {
            console.error(e)
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
            console.error(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при создании спектакля!'
            }
        }
    }

    async updatePlay(idPlay: number, payload: PlayBaseInterface) {
        const trx = await KnexConnection.transaction()
        try {
            const query = await this.playDatabaseInstance.get({ id: idPlay})
            if (!query) {
                return <InnerErrorInterface>{
                    code: 404,
                    message: 'Запись спектакля не найдена!'
                }
            }
            await this.playDatabaseInstance.update(trx, idPlay, payload)
            await trx.commit()
        } catch (e) {
            console.error(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при обновлении спектакля!'
            }
        }
    }

    async deletePlay(idPlay: number) {
        const trx = await KnexConnection.transaction()
        try {
            const query = await this.playDatabaseInstance.get({ id: idPlay })
            if (!query) {
                return <InnerErrorInterface>{
                    code: 404,
                    message: 'Запись спектакля не найдена!'
                }
            }
            await this.playDatabaseInstance.delete(trx, idPlay)
            await trx.commit()
        } catch (e) {
            console.error(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при удалении спектакля!'
            }
        }
    }
    async createPlaysCSV(file: UploadedFile) {
        let dataArray: PlayBaseInterface[] = []
        fs.createReadStream(file.tempFilePath)
            .pipe(csvParser())
            .on("data", (data) => {
                dataArray.push({ 
                    title: data["Название"], 
                    description: data["Описание"]
                })
            })
            .on("end", async () => {
                let trx = await KnexConnection.transaction()
                try {
                    this.playDatabaseInstance.insertAll(trx, dataArray)
                    await trx.commit()
                } catch(e) {
                    await trx.rollback()
                    return <InnerErrorInterface>{
                        code: 500,
                        message: 'Внутренняя ошибка при вставке записей: ' + e
                    }
                }
            })
    }
}
