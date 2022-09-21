import csvParser from "csv-parser"
import { UploadedFile } from "express-fileupload"
import { InnerError, InnerErrorInterface } from "../../interfaces/errors"
import { SessionBaseInterface } from "../../interfaces/sessions"
import { FileStreamHelper } from "../../utils/fileStreams"
import fs from "fs"
import { ISessionRepo } from "../../repositories/Session.repo"

export interface ISessionCSVService {
    createSessionsCSV(file: UploadedFile): Promise<void>
}


export class SessionCSVService implements ISessionCSVService {
    protected fileStreamHelper
    protected sessionRepo

    constructor(
        fileStreamHelperInstance: FileStreamHelper,
        sessionRepoInstance: ISessionRepo
    ) {
        this.fileStreamHelper = fileStreamHelperInstance
        this.sessionRepo = sessionRepoInstance
    }

    public async createSessionsCSV(file: UploadedFile) {
        let dataArray: SessionBaseInterface[] = []
        const data = await this.fileStreamHelper
            .readData(fs.createReadStream(file.tempFilePath).pipe(csvParser()))
        for (const chunk of data) {
            if (!chunk["Номер строки"]) 
                throw new InnerError(`Не указан номер строки в файле!`, 400)
            else if (!chunk["Спектакль" ]) 
                throw new InnerError(`В строке ${chunk["Номер строки"]} не указан идентификатор спектакля!`, 400)
            else if (!chunk["Ценовая политика"]) 
                throw new InnerError(`В строке ${chunk["Номер строки"]} не указан идентификатор ценовой политики!`, 400)
            else if (!chunk["Максимум мест"]) 
                throw new InnerError(`В строке ${chunk["Номер строки"]} не указан максимум мест для брони!`, 400)
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
        await this.sessionRepo.createSessions(dataArray)
    }
}