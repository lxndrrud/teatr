import { KnexConnection }from "../knex/connections"
import { Request, Response } from "express"
import * as SessionModel from "../models/sessions"
import { TimestampSessionFilterOptionInterface } from "../interfaces/timestamps"
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface } 
    from "../interfaces/sessions"
import { dateFromTimestamp, extendedDateFromTimestamp, extendedTimestamp } from "../utils/timestamp"
import { SlotIsReservedInterface } from "../interfaces/slots"
import { SessionFetchingInstance } from "../fetchingModels/sessions"


export const getSessions = async (req: Request, res: Response) => {
    const query = await SessionFetchingInstance.getUnlockedSessions()
    res.status(200).send(query)
}

export const getSingleSession = async (req: Request, res: Response) => {
    const idSession = parseInt(req.params.idSession)
    if (!idSession) {
        res.status(400).end()
        return 
    }
    const query = await SessionFetchingInstance.getSingleUnlockedSession(idSession)
    if (query) {
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
    
    const query = await SessionFetchingInstance.getSessionsByPlay(idPlay)

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
    
    const result = await SessionFetchingInstance.getSlots(idSession, session.id_price_policy)

    res.status(200).send(result)
}

export const getFilteredSessions = async (req: Request, res: Response) => {
    const userQuery: SessionFilterQueryInterface = {...req.query}

    const query = await SessionFetchingInstance.getFilteredSessions(userQuery)

    for (let session of query) {
        session.timestamp = extendedTimestamp(session.timestamp)
    }

    res.status(200).send(query)
}

export const getSessionFilterOptions = async (req: Request, res: Response) => {
    const query = await SessionFetchingInstance.getSessionFilterOptions()

    res.status(200).send(query)
}