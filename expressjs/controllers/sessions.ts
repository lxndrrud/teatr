import { KnexConnection }from "../knex/connections"
import { Request, Response } from "express"
import * as SessionModel from "../models/sessions"
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface } 
    from "../interfaces/sessions"


export const getSessions = async (req: Request, res: Response) => {
    const query = await SessionModel.getUnlockedSessions()
    res.statusCode = 200
    res.send(query)
}

export const getSingleSession = async (req: Request, res: Response) => {
    const idSession = parseInt(req.params.idSession)
    if (!idSession) {
        res.statusCode = 400
        return 
    }
    const query = await SessionModel.getSingleSession(idSession)
    if (query) {
        const result: SessionInterface = {...query}
        res.statusCode = 200
        res.send(result)
    }
    else {
        res.statusCode = 404
    }
}

export const postSession = async (req: Request, res: Response) => {
    try {
        const payload: SessionBaseInterface = {...req.body}
        const trx = await KnexConnection.transaction()
        try {
            const newSession = await SessionModel.postSession(trx, payload)
            await trx.commit()
            res.statusCode = 201
            res.send({
                id: newSession.at(0).id
            })
        }
        catch (e) {
            await trx.rollback()
            console.log(e)
            res.statusCode = 500
        }
    } catch (e) {
        console.log(e)
        res.statusCode = 400
    }
}

export const updateSession = async (req: Request, res: Response) => {
    try {
        const idSession = parseInt(req.params.idSession)
        if (!idSession) throw 'Не найден идентификатор сеанса!'
        const payload: SessionBaseInterface = {...req.body}
        const query = await SessionModel.getSingleSession(idSession)
        if (!query) { 
            res.statusCode = 404
            return 
        }
        const trx = await KnexConnection.transaction()
        try {
            await SessionModel.updateSession(trx, idSession, payload)
            await trx.commit()
        }
        catch (e) {
            await trx.rollback()
            console.log(e)
            res.statusCode = 500
        }
    }
    catch (e) {
        console.log(e)
        res.statusCode = 400
    }
}

export const deleteSession = async (req: Request, res: Response) => {
    const idSession = parseInt(req.params.idSession)
    const query = await SessionModel.getSingleSession(idSession)
    if (!query) {
        res.statusCode = 404
        return
    }
    const trx = await KnexConnection.transaction()
    try {
        await SessionModel.deleteSession(trx, idSession)
        await trx.commit()
        res.statusCode = 200
    }
    catch (e) {
        await trx.rollback()
        console.log(e)
        res.statusCode = 500
    }
}

export const getSessionsByPlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    if (!idPlay) {
        res.statusCode = 400
        return 
    }
    const query = await SessionModel.getSessionsByPlay(idPlay)
    res.statusCode = 200
    res.send(query)
}

export const getFilteredSessions = async (req: Request, res: Response) => {

}

export const getSessionFilterOptions = async (req: Request, res: Response) => {

}