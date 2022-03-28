import { Knex } from "knex";
import { SessionDatabaseModel } from "../dbModels/sessions";
import { AuditoriumSessionFilterOption } from "../interfaces/auditoriums";
import { PlaySessionFilterOptionInterface } from "../interfaces/plays";
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface, SessionDatabaseInterface } 
    from "../interfaces/sessions";
import { SlotIsReservedInterface, SlotInterface } from "../interfaces/slots"
import { TimestampSessionFilterOptionDatabaseInterface, TimestampSessionFilterOptionInterface } from "../interfaces/timestamps"
import { dateFromTimestamp, extendedDateFromTimestamp, extendedTimestamp } from "../utils/timestamp"


class SessionFetchingModel {

    fixTimestamps(query: SessionInterface[]) {
        for (let session of query) {
            session.timestamp = extendedTimestamp(session.timestamp)
        }
        return query
    }

    async getUnlockedSessions(): Promise<SessionInterface[]> {
        const query = await new SessionDatabaseModel().unlockedSessions()
        const fetchedQuery = this.fixTimestamps(query)
        return fetchedQuery
    }

    async getSingleUnlockedSession(id: number): Promise<SessionInterface> {
        const query = await new SessionDatabaseModel().get({
            id: id,
            is_locked: false
        })
        const fetchedQuery = this.fixTimestamps([query])
        return fetchedQuery[0]
    }

    async getSessionsByPlay(idPlay: number): Promise<SessionInterface[]> {
        const query = await new SessionDatabaseModel().getSessionsByPlay(idPlay)
        const fetchedQuery = this.fixTimestamps(query)
        return fetchedQuery
    }
    
    async getSlots(idSession:number, idPricePolicy: number) {
        const SessionModel = new SessionDatabaseModel()

        const [rowsQuery, slotsQuery, reservedSlotsQuery] = await Promise.all([
            SessionModel.getRowsByPricePolicy(idPricePolicy),
            SessionModel.getSlotsByPricePolicy(idPricePolicy),
            SessionModel.getReservedSlots(idSession, idPricePolicy)
        ])
    
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
    
    getReservedSlots(idSession: number, idPricePolicy: number): Promise<SlotInterface[]>{
        return new SessionDatabaseModel().getReservedSlots(idSession, idPricePolicy)
    }

    async getSessionFilterOptions() {
        const SessionModel = new SessionDatabaseModel()

        let timestamps: TimestampSessionFilterOptionDatabaseInterface[],
            auditoriums: AuditoriumSessionFilterOption[],
            plays: PlaySessionFilterOptionInterface[]
        [timestamps, auditoriums, plays] = await Promise.all([
            SessionModel.getSessionFilterTimestamps(),
            SessionModel.getSessionFilterAuditoriums(),
            SessionModel.getSessionFilterPlays()
        ])
    
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

    async getFilteredSessions(userQueryPayload: SessionFilterQueryInterface): Promise<SessionInterface[]> {
        const query = await new SessionDatabaseModel().getFilteredSessions(userQueryPayload)
        const fetchedQuery = this.fixTimestamps(query)
        return fetchedQuery
    }
}

export const SessionFetchingInstance = new SessionFetchingModel()