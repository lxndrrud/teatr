import fs from "fs"
import { UploadedFile } from "express-fileupload";
import { Knex } from "knex";
import { SessionModel } from "../dbModels/sessions";
import { AuditoriumSessionFilterOption } from "../interfaces/auditoriums";
import { InnerErrorInterface, isInnerErrorInterface } from "../interfaces/errors";
import { PlaySessionFilterOptionInterface } from "../interfaces/plays";
import { RowInterface } from "../interfaces/rows";
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface, SessionDatabaseInterface } 
    from "../interfaces/sessions";
import { SlotIsReservedInterface, SlotInterface, SlotWithRowIdInterface } from "../interfaces/slots"
import { TimestampSessionFilterOptionDatabaseInterface, TimestampSessionFilterOptionInterface } from "../interfaces/timestamps"
import { KnexConnection } from "../knex/connections";
import { dateFromTimestamp, extendedDateFromTimestamp, extendedTimestamp } from "../utils/timestamp"
import csvParser from "csv-parser";
import { Readable } from "stream";
import { FileStreamHelper } from "../utils/fileStreams";


export interface SessionService {
    createSession(payload: SessionBaseInterface): Promise<SessionDatabaseInterface | InnerErrorInterface>
    createSessionsCSV(file: UploadedFile): Promise<undefined | InnerErrorInterface>
    updateSession(idSession: number, payload: SessionBaseInterface): Promise<InnerErrorInterface | undefined>
    deleteSession(idSession: number): Promise<InnerErrorInterface | undefined>
    getUnlockedSessions(): Promise<SessionInterface[] | InnerErrorInterface>
    getSingleUnlockedSession(idSession: number): Promise<InnerErrorInterface | SessionInterface>
    getSessionsByPlay(idPlay: number): Promise<SessionInterface[] | InnerErrorInterface>
    getSlots(idSession: number): Promise<InnerErrorInterface | {
        number: number;
        title: string;
        seats: SlotIsReservedInterface[];
    }[]>
    getSessionFilterOptions(): Promise<InnerErrorInterface | {
        dates: TimestampSessionFilterOptionInterface[];
        auditoriums: AuditoriumSessionFilterOption[];
        plays: PlaySessionFilterOptionInterface[];
    }>
    getFilteredSessions(userQueryPayload: SessionFilterQueryInterface): Promise<SessionInterface[] | InnerErrorInterface>
    getReservedSlots(idReservation: number, idPricePolicy: number): Promise<SlotInterface[] | InnerErrorInterface>
}

export class SessionFetchingModel implements SessionService {
    protected sessionDatabaseInstance 

    constructor(sessionDatabaseModel: SessionModel) {
        this.sessionDatabaseInstance = sessionDatabaseModel
    }

    private fixTimestamps(query: SessionInterface[]) {
        for (let session of query) {
            session.timestamp = extendedTimestamp(session.timestamp)
        }
        return query
    }

    public async createSession(payload: SessionBaseInterface) {
        const trx = await KnexConnection.transaction()
        try {
            const newSession: SessionDatabaseInterface = (await this.sessionDatabaseInstance.insert(trx, payload))[0]
            await trx.commit()
            return newSession
        } catch(e) {
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: "Внутреннняя ошибка сервера при создании сеанса!"
            }
        }
    }

    public async createSessionsCSV(file: UploadedFile) {
        let dataArray: SessionBaseInterface[] = []
        const data = await FileStreamHelper
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
        let trx = await KnexConnection.transaction()
        try {
            await this.sessionDatabaseInstance.insertAll(trx, dataArray)
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

    public async updateSession(idSession: number, payload: SessionBaseInterface) {
        try {
            const query = await this.sessionDatabaseInstance.get({ id: idSession })
            if (!query) { 
                return <InnerErrorInterface>{
                    code: 404,
                    message: 'Запись сеанса не найдена!'
                }
            }
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске записи сеанса: ' + e
            }
        }
        const trx = await KnexConnection.transaction()
        try {
            await this.sessionDatabaseInstance.update(trx, idSession, payload)
            await trx.commit()
        }
        catch (e) {
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при обновлении сеанса: ' + e
            }
        }
    }

    public async deleteSession(idSession: number) {
        const query = await this.sessionDatabaseInstance.get({id: idSession})
        if (!query) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Запись сеанса не найдена!'
            }
        }
        const trx = await KnexConnection.transaction()
        try {
            await this.sessionDatabaseInstance.delete(trx, idSession)
            await trx.commit()
        }
        catch (e) {
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутреняя ошибка сервера при удалении сеанса!'
            }
        }
    }

    public async getUnlockedSessions() {
        try {
            const query: SessionInterface[] = await this.sessionDatabaseInstance.getUnlockedSessions()
            const fetchedQuery = this.fixTimestamps(query)
            return fetchedQuery
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске сеансов!'
            }
        }
    }

    public async getSingleUnlockedSession(idSession: number) {
        try {
            const query: SessionInterface | undefined = await this.sessionDatabaseInstance.getSingleUnlockedSession(idSession)
            if (!query) {
                return <InnerErrorInterface>{
                    code: 404,
                    message: 'Сеанс не найден!'
                }
            }
            const fetchedQuery = this.fixTimestamps([query])
            return fetchedQuery[0]
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске сеанса!'
            }
        }
    }

    public async getSessionsByPlay(idPlay: number) {
        try {
            const query: SessionInterface[] = await this.sessionDatabaseInstance
                .getSessionsByPlay(idPlay)
            const fetchedQuery = this.fixTimestamps(query)
            return fetchedQuery
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске сеансов по спектаклю!'
            }
        }
    }
    
    async getSlots(idSession: number) {
        let session: SessionInterface | undefined
        try {
            session = await this.sessionDatabaseInstance.get({id: idSession})
        } catch (e) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при нахождении сеанса!'
            }
        }
        if (!session) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Запись сеанса не найдена!'
            }
        }

        const idPricePolicy = session.id_price_policy
    
        let rowsQuery: RowInterface[],
            slotsQuery: SlotWithRowIdInterface[],
            reservedSlotsQuery: SlotInterface[]

        try {
            [rowsQuery, slotsQuery, reservedSlotsQuery] = await Promise.all([
                this.sessionDatabaseInstance.getRowsByPricePolicy(idPricePolicy),
                this.sessionDatabaseInstance.getSlotsByPricePolicy(idPricePolicy),
                this.sessionDatabaseInstance.getReservedSlots(idSession, idPricePolicy)
            ])
        } catch (e) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске слотов!'
            }
        }
        
    
        let result: { 
            id: number,
            number: number,
            title: string,
            seats: SlotIsReservedInterface[] 
        }[] = []
    
        for (let row of rowsQuery) {
            const rowSlots = slotsQuery.filter((slot) => slot.id_row == row.id)
            const reservedSlotsMap = reservedSlotsQuery.map(reservedSlot => reservedSlot.id)
            let slots: SlotIsReservedInterface[] = []
            for (let slot of rowSlots) {
                if (reservedSlotsMap.includes(slot.id)) {
                    const item: SlotIsReservedInterface = {
                        id: slot.id,
                        seat_number: slot.seat_number,
                        row_number: slot.row_number,
                        price: slot.price,
                        auditorium_title: slot.auditorium_title,
                        row_title: slot.row_title,
                        is_reserved: true
                    }
                    slots.push(item)
                }
                else {
                    const item: SlotIsReservedInterface = {
                        id: slot.id,
                        seat_number: slot.seat_number,
                        row_number: slot.row_number,
                        price: slot.price,
                        auditorium_title: slot.auditorium_title,
                        row_title: slot.row_title,
                        is_reserved: false
                    }
                    slots.push(item)
                }
            }
            result.push({
                id: row.id,
                number: row.number,
                title: row.title,
                seats: slots
            })
        }
        result.sort((a: {  id: number, number: number, title: string, seats: SlotIsReservedInterface[] }, 
            b: {  id: number, number: number, title: string, seats: SlotIsReservedInterface[] }) => {
                if (a.id > b.id ) return 1
                else if (a.id < b.id ) return -1
                else return 0
        })
        const resultList: { 
            number: number,
            title: string,
            seats: SlotIsReservedInterface[] 
        }[] = []
        result.forEach(item => {
            resultList.push({
                number: item.number,
                title: item.title,
                seats: item.seats
            })
        })
        return resultList
    }

    public async getSessionFilterOptions() {
        let timestamps: TimestampSessionFilterOptionDatabaseInterface[],
            auditoriums: AuditoriumSessionFilterOption[],
            plays: PlaySessionFilterOptionInterface[]
        try {
            [timestamps, auditoriums, plays] = await Promise.all([
                this.sessionDatabaseInstance.getSessionFilterTimestamps(),
                this.sessionDatabaseInstance.getSessionFilterAuditoriums(),
                this.sessionDatabaseInstance.getSessionFilterPlays()
            ])
        } catch (e) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске значений для фильтра!'
            }
        }
        
    
        let dates: TimestampSessionFilterOptionInterface[] = []
        let distinctCheck: Map<string, string> = new Map()
        for (let row of timestamps) {
            const extendedDate = extendedDateFromTimestamp(row.timestamp)
            const simpleDate = dateFromTimestamp(row.timestamp)
            if (!distinctCheck.has(simpleDate)) {
                dates.push({
                    date: simpleDate,
                    extended_date: extendedDate
                })
                distinctCheck.set(simpleDate, simpleDate)
            }
        }

        return {
            dates,
            auditoriums,
            plays
        }
    }

    public async getFilteredSessions(userQueryPayload: SessionFilterQueryInterface) {
        try {
            const query: SessionInterface[] = await this.sessionDatabaseInstance
                .getFilteredSessions(userQueryPayload)
            const fetchedQuery = this.fixTimestamps(query)
            return fetchedQuery
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске отфильтрованных сеансов!'
            }
        }
        
    }

    public async getReservedSlots(idReservation: number, idPricePolicy: number) {
        try {
            const query: SlotInterface[] = await this.sessionDatabaseInstance
                .getReservedSlots(idReservation, idPricePolicy)
            return query
        } catch(e) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
    }
}
