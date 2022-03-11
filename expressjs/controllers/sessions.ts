import { KnexConnection }from "../knex/connections"
import { Request, Response } from "express"
import * as SessionModel from "../models/sessions"
import { TimestampSessionFilterOptionInterface } from "../interfaces/timestamps"
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface } 
    from "../interfaces/sessions"
import { dateFromTimestamp, extendedDateFromTimestamp, extendedTimestamp } from "../utils/timestamp"
import { SlotIsReservedInterface } from "../interfaces/slots"


export const getSessions = async (req: Request, res: Response) => {
    const query = await SessionModel.getUnlockedSessions()
    for (let session of query) {
        session.timestamp = extendedTimestamp(session.timestamp)
    }
    res.status(200).send(query)
}

export const getSingleSession = async (req: Request, res: Response) => {
    const idSession = parseInt(req.params.idSession)
    if (!idSession) {
        res.status(400).end()
        return 
    }
    const query = await SessionModel.getSingleSession(idSession)
    if (query) {
        query.timestamp = extendedTimestamp(query.timestamp)
        res.status(200).send(query)
    }
    else {
        res.status(404).end()
    }
}

export const postSession = async (req: Request, res: Response) => {
    try {
        const payload: SessionBaseInterface = {...req.body}
        const trx = await KnexConnection.transaction()
        try {
            const newSession = await SessionModel.createSession(trx, payload)
            await trx.commit()
            res.status(201).send({
                id: newSession[0].id
            })
        }
        catch (e) {
            await trx.rollback()
            console.log(e)
            res.status(500).end()
        }
    } catch (e) {
        console.log(e)
        res.status(400).end()
    }
}

export const updateSession = async (req: Request, res: Response) => {
    try {
        const idSession = parseInt(req.params.idSession)
        if (!idSession) throw 'Не найден идентификатор сеанса!'
        const payload: SessionBaseInterface = {...req.body}
        const query = await SessionModel.getSingleSession(idSession)
        if (!query) { 
            res.status(404).end()
            return 
        }
        const trx = await KnexConnection.transaction()
        try {
            await SessionModel.updateSession(trx, idSession, payload)
            await trx.commit()
            res.status(200).end()
        }
        catch (e) {
            await trx.rollback()
            console.log(e)
            res.status(500).end()
        }
    }
    catch (e) {
        console.log(e)
        res.status(400).end()
    }
}

export const deleteSession = async (req: Request, res: Response) => {
    const idSession = parseInt(req.params.idSession)
    const query = await SessionModel.getSingleSession(idSession)
    if (!query) {
        res.status(404).end()
        return
    }
    const trx = await KnexConnection.transaction()
    try {
        await SessionModel.deleteSession(trx, idSession)
        await trx.commit()
        res.status(200).end()
    }
    catch (e) {
        await trx.rollback()
        console.log(e)
        res.status(500).end()
    }
}

export const getSessionsByPlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    if (!idPlay) {
        res.status(400).end()
        return 
    }
    
    const query = await SessionModel.getSessionsByPlay(idPlay)

    for (let session of query) {
        session.timestamp = extendedTimestamp(session.timestamp)
    }

    res.status(200).send(query)
}

export const getSlotsForSessions = async (req: Request, res: Response) => {
    const idSession = parseInt(req.params.idSession)
    if (!idSession) {
        res.status(400).end()
        return
    }
    const session = await SessionModel.getSingleSession(idSession)
    if (!session) {
        res.status(404).end()
        return
    }
    
    const [rowsQuery, slotsQuery, reservedSlotsQuery] = await Promise.all([
        SessionModel.getRowsByPricePolicy(session.id_price_policy),
        SessionModel.getSlotsByPricePolicy(session.id_price_policy),
        SessionModel.getReservedSlots(idSession, session.id_price_policy)
    ])

    let result = []

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
    res.status(200).send(result)
}

export const getFilteredSessions = async (req: Request, res: Response) => {
    const userQuery: SessionFilterQueryInterface = {...req.query}

    const query = await SessionModel.getFilteredSessions(userQuery)

    for (let session of query) {
        session.timestamp = extendedTimestamp(session.timestamp)
    }

    res.status(200).send(query)
}

export const getSessionFilterOptions = async (req: Request, res: Response) => {
    let [timestamps, auditoriums, plays] = await Promise.all([
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

    res.status(200).send({
        dates,
        auditoriums,
        plays
    })
}