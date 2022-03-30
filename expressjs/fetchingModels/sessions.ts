import { Request } from "express";
import { Knex } from "knex";
import { SessionDatabaseInstance } from "../dbModels/sessions";
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


class SessionFetchingModel {
    protected sessionDatabaseInstance 

    constructor() {
        this.sessionDatabaseInstance = SessionDatabaseInstance
    }

    fixTimestamps(query: SessionInterface[]) {
        for (let session of query) {
            session.timestamp = extendedTimestamp(session.timestamp)
        }
        return query
    }

    async createSession(payload: SessionBaseInterface) {
        const trx = await KnexConnection.transaction()
        try {
            const newSession: SessionDatabaseInterface = (await this.sessionDatabaseInstance.insert(trx, payload))[0]
            await trx.commit()
            return newSession
        } catch(e) {
            await trx.rollback()
            return 500
        }
    }

    async updateSession(idSession: number, payload: SessionBaseInterface) {
        const query = await this.sessionDatabaseInstance.get({ id: idSession })
        if (!query) { 
            return 404
        }
        const trx = await KnexConnection.transaction()
        try {
            await this.sessionDatabaseInstance.update(trx, idSession, payload)
            await trx.commit()
            return 200
        }
        catch (e) {
            await trx.rollback()
            return 500
        }
    }

    async deleteSession(idSession: number) {
        const query = await this.sessionDatabaseInstance.get({id: idSession})
        if (!query) {
            return 404
        }
        const trx = await KnexConnection.transaction()
        try {
            await this.sessionDatabaseInstance.delete(trx, idSession)
            await trx.commit()
            return 200
        }
        catch (e) {
            await trx.rollback()
            return 500
        }
    }

    async getUnlockedSessions(): Promise<SessionInterface[] | InnerErrorInterface> {
        try {
            const query = await this.sessionDatabaseInstance.getUnlockedSessions()
            const fetchedQuery = this.fixTimestamps(query)
            return fetchedQuery
        } catch (e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске сеансов!'
            }
        }
    }

    async getSingleUnlockedSession(idSession: number): Promise<SessionInterface | InnerErrorInterface> {
        try {
            const query = await this.sessionDatabaseInstance.getSingleUnlockedSession(idSession)
            const fetchedQuery = this.fixTimestamps([query])
            return fetchedQuery[0]
        } catch (e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске сеанса!'
            }
        }
    }

    async getSessionsByPlay(idPlay: number): Promise<SessionInterface[] | 500> {
        try {
            const query: SessionInterface[] = await this.sessionDatabaseInstance.getSessionsByPlay(idPlay)
            const fetchedQuery = this.fixTimestamps(query)
            return fetchedQuery
        } catch (e) {
            console.log(e)
            return 500
        }
    }
    
    async getSlots(idSession: number) {
        let session: SessionInterface | undefined
        try {
            session = await this.sessionDatabaseInstance.get({id: idSession})
        } catch (e) {
            return 500
        }

        if (!session) {
            return 404
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
            return 500
        }
        
    
        let result: { number: number, seats: SlotIsReservedInterface[] }[] = []
    
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
                number: row.number,
                seats: slots
            })
        }
        return result
    }

    async getSessionFilterOptions() {
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
            return 500
        }
        
    
        let dates: TimestampSessionFilterOptionInterface[] = []
        let distinctCheck: Map<string, string> = new Map()
        for (let row of timestamps) {
            if (!distinctCheck.has(dateFromTimestamp(row.timestamp))) {
                dates.push({
                    date: dateFromTimestamp(row.timestamp),
                    extended_date: extendedDateFromTimestamp(row.timestamp)
                })
                distinctCheck.set(dateFromTimestamp(row.timestamp), dateFromTimestamp(row.timestamp))
            }
        }

        return {
            dates,
            auditoriums,
            plays
        }
    }

    async getFilteredSessions(userQueryPayload: SessionFilterQueryInterface): Promise<SessionInterface[] | 500> {
        try {
            const query = await this.sessionDatabaseInstance.getFilteredSessions(userQueryPayload)
            const fetchedQuery = this.fixTimestamps(query)
            return fetchedQuery
        } catch (e) {
            console.log(500)
            return 500
        }
        
    }

    async getReservedSlots(idReservation: number, idPricePolicy: number): Promise<SlotInterface[] | InnerErrorInterface> {
        try {
            const query = await this.sessionDatabaseInstance
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

export const SessionFetchingInstance = new SessionFetchingModel()