import { Knex } from "knex"
import { SessionModel } from "../../dbModels/sessions"
import { ISessionInfrastructure } from "../../infrastructure/Session.infra"
import { InnerErrorInterface } from "../../interfaces/errors"
import { RowInterface } from "../../interfaces/rows"
import { SessionBaseInterface, SessionDatabaseInterface, SessionInterface } from "../../interfaces/sessions"
import { SlotInterface, SlotIsReservedInterface, SlotWithRowIdInterface } from "../../interfaces/slots"


export interface ISessionCRUDService {
    createSession(payload: SessionBaseInterface): 
    Promise<SessionDatabaseInterface | InnerErrorInterface>

    updateSession(idSession: number, payload: SessionBaseInterface): 
    Promise<InnerErrorInterface | undefined>

    deleteSession(idSession: number): Promise<InnerErrorInterface | undefined>

    getUnlockedSessions(): Promise<SessionInterface[] | InnerErrorInterface>

    getSingleUnlockedSession(idSession: number): Promise<InnerErrorInterface | SessionInterface>

    getSessionsByPlay(idPlay: number): Promise<SessionInterface[] | InnerErrorInterface>

    getSlots(idSession: number): 
    Promise<InnerErrorInterface | {
        number: number;
        title: string;
        seats: SlotIsReservedInterface[];
    }[]>
}

export class SessionCRUDService implements ISessionCRUDService {
    protected connection
    protected sessionModel
    protected sessionInfrastructure

    constructor(
        connectionInstance: Knex<any, unknown[]>,
        sessionModelInstance: SessionModel,
        sessionInfrastructureInstance: ISessionInfrastructure
    ) {
        this.connection = connectionInstance
        this.sessionModel= sessionModelInstance
        this.sessionInfrastructure = sessionInfrastructureInstance
    }

    public async createSession(payload: SessionBaseInterface) {
        const trx = await this.connection.transaction()
        try {
            const newSession: SessionDatabaseInterface = (await this.sessionModel.insert(trx, payload))[0]
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
    public async updateSession(idSession: number, payload: SessionBaseInterface) {
        try {
            const query = await this.sessionModel.get({ id: idSession })
            if (!query) { 
                return <InnerErrorInterface>{
                    code: 404,
                    message: 'Запись сеанса не найдена!'
                }
            }
        } catch (e) {
            console.error(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске записи сеанса: ' + e
            }
        }
        const trx = await this.connection.transaction()
        try {
            await this.sessionModel.update(trx, idSession, payload)
            await trx.commit()
        }
        catch (e) {
            console.error(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при обновлении сеанса: ' + e
            }
        }
    }

    public async deleteSession(idSession: number) {
        const query = await this.sessionModel.get({id: idSession})
        if (!query) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Запись сеанса не найдена!'
            }
        }
        const trx = await this.connection.transaction()
        try {
            await this.sessionModel.delete(trx, idSession)
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
            const query: SessionInterface[] = await this.sessionModel.getUnlockedSessions()
            const fetchedQuery = this.sessionInfrastructure.fixTimestamps(query)
            return fetchedQuery
        } catch (e) {
            console.error(e)
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске сеансов!'
            }
        }
    }

    public async getSingleUnlockedSession(idSession: number) {
        try {
            const query: SessionInterface | undefined = await this.sessionModel.getSingleUnlockedSession(idSession)
            if (!query) {
                return <InnerErrorInterface>{
                    code: 404,
                    message: 'Сеанс не найден!'
                }
            }
            const fetchedQuery = this.sessionInfrastructure.fixTimestamps([query])
            return fetchedQuery[0]
        } catch (e) {
            console.error(e)
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске сеанса!'
            }
        }
    }

    public async getSessionsByPlay(idPlay: number) {
        try {
            const query: SessionInterface[] = await this.sessionModel
                .getSessionsByPlay(idPlay)
            const fetchedQuery = this.sessionInfrastructure.fixTimestamps(query)
            return fetchedQuery
        } catch (e) {
            console.error(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске сеансов по спектаклю!'
            }
        }
    }

    public async getSlots(idSession: number) {
        let session: SessionInterface | undefined
        try {
            session = await this.sessionModel.get({id: idSession})
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
                this.sessionModel.getRowsByPricePolicy(idPricePolicy),
                this.sessionModel.getSlotsByPricePolicy(idPricePolicy),
                this.sessionModel.getReservedSlots(idSession, idPricePolicy)
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
}