import csvParser from "csv-parser"
import { UploadedFile } from "express-fileupload"
import { SessionModel } from "../../dbModels/sessions"
import { InnerErrorInterface } from "../../interfaces/errors"
import { SessionBaseInterface } from "../../interfaces/sessions"
import { FileStreamHelper } from "../../utils/fileStreams"
import fs from "fs"
import { Knex } from "knex"

export interface ISessionCSVService {
    createSessionsCSV(file: UploadedFile): 
    Promise<InnerErrorInterface | undefined>
}


export class SessionCSVService {
    protected connection
    protected fileStreamHelper
    protected sessionModel

    constructor(
        connectionInstance: Knex<any, unknown[]>,
        fileStreamHelperInstance: FileStreamHelper,
        sessionModelInstance: SessionModel
    ) {
        this.connection = connectionInstance
        this.fileStreamHelper = fileStreamHelperInstance
        this.sessionModel = sessionModelInstance
    }

    public async createSessionsCSV(file: UploadedFile) {
        let dataArray: SessionBaseInterface[] = []
        const data = await this.fileStreamHelper
            .readData(fs.createReadStream(file.tempFilePath).pipe(csvParser()))
        for (const chunk of data) {
            if (!chunk["Номер строки"]) return <InnerErrorInterface> {
                code: 400,
                message: `Не указан номер строки в файле!`
            }   
            else if (!chunk["Спектакль" ]) return <InnerErrorInterface> {
                code: 400,
                message: `В строке ${chunk["Номер строки"]} не указан идентификатор спектакля!`
            }
            else if (!chunk["Ценовая политика"]) return <InnerErrorInterface> {
                code: 400,
                message: `В строке ${chunk["Номер строки"]} не указан идентификатор ценовой политики!`
            }
            else if (!chunk["Максимум мест"]) return <InnerErrorInterface> {
                code: 400,
                message: `В строке ${chunk["Номер строки"]} не указан максимум мест для брони!`
            }
            let toPush = <SessionBaseInterface> {
                id_play: parseInt(chunk["Спектакль"]) ,
                id_price_policy: parseInt(chunk["Ценовая политика"]),
                timestamp: chunk["Дата и время"],
                is_locked: chunk["Закрыт"] === "Да"? true: false,
                max_slots: parseInt(chunk["Максимум мест"])
            }
            dataArray.push(toPush)
        }
        fs.unlinkSync(file.tempFilePath)
        let trx = await this.connection.transaction()
        try {
            await this.sessionModel.insertAll(trx, dataArray)
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