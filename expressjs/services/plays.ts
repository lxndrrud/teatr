import { Knex } from "knex";
import { PlayModel } from "../dbModels/plays";
import { PlayBaseInterface, PlayInterface, PlayWithPosterInterface } from "../interfaces/plays";
import { InnerErrorInterface } from "../interfaces/errors";
import { UploadedFile } from "express-fileupload";
import { UserRequestOption } from "../interfaces/users";
import fs from "fs"
import csvParser from "csv-parser";
import { FileStreamHelper } from "../utils/fileStreams";

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
    protected fileStreamHelper
    protected connection

    constructor(
        connectionInstance: Knex<any, unknown[]>,
        playModelInstance: PlayModel,
        fileStreamHelperInstance: FileStreamHelper
    ) {
        this.connection = connectionInstance
        this.playDatabaseInstance = playModelInstance
        this.fileStreamHelper = fileStreamHelperInstance
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
        const trx = await this.connection.transaction()
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
        const trx = await this.connection.transaction()
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
        const trx = await this.connection.transaction()
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
        const data = await this.fileStreamHelper
            .readData(fs.createReadStream(file.tempFilePath).pipe(csvParser()))
        for (const chunk of data) {
            if (!chunk["Номер строки"]) return <InnerErrorInterface> {
                code: 400,
                message: `Не указан номер строки в файле!`
            }
            else if (!chunk["Название"]) return <InnerErrorInterface> {
                code: 400,
                message: `В строке ${chunk["Номер строки"]} не указано название спектакля!`
            }
            dataArray.push({ 
                title: chunk["Название"], 
                description: chunk["Описание"]
            })
        }
        fs.rmSync(file.tempFilePath)
        //fs.unlinkSync(file.tempFilePath)
        let trx = await this.connection.transaction()
        try {
            await this.playDatabaseInstance.insertAll(trx, dataArray)
            await trx.commit()
        } catch(e) {
            console.error(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка при вставке записей: ' + e
            }
        }
    }
}
