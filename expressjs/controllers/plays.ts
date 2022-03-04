import { KnexConnection }from "../knex/connections"
import { Request, Response } from "express"
import * as PlayModel from "../models/plays"
import { PlayBaseInterface, PlayInterface } from "../interfaces/plays"

export const getPlays = async (req: Request, res: Response) => {
    const query = await PlayModel.getPlays()
    res.statusCode = 200
    res.send(query)
}

export const postPlay = async (req: Request, res: Response) => {
    try {
        const payload: PlayBaseInterface = {...req.body}
        const trx = await KnexConnection.transaction()
        try {
            const newPlay = await PlayModel.postPlay(trx, payload)
            await trx.commit()
            res.statusCode = 201
            res.send({
                id: newPlay.at(0).id
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

export const getSinglePlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    if (!idPlay) {
        res.statusCode = 400
        return 
    }
    const query = await PlayModel.getSinglePlay(idPlay)
    if (query) {
        const result: PlayInterface = {...query}
        res.statusCode = 200
        res.send(result)
    }
    else {
        res.statusCode = 404
    }
}
    

export const deletePlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    const query = await PlayModel.getSinglePlay(idPlay)
    if (!query) {
        res.statusCode = 404
        return
    }
    const trx = await KnexConnection.transaction()
    try {
        await PlayModel.deletePlay(trx, idPlay)
        await trx.commit()
        res.statusCode = 200
    }
    catch (e) {
        await trx.rollback()
        console.log(e)
        res.statusCode = 500
    }
}

export const updatePlay = async (req: Request, res: Response) => {
    try {
        const idPlay = parseInt(req.params.idPlay)
        if (!idPlay) throw 'Не найден идентификатор спектакля!'
        const payload: PlayBaseInterface = {...req.body}
        const query = await PlayModel.getSinglePlay(idPlay)
        if (!query) { 
            res.statusCode = 404
            return 
        }
        const trx = await KnexConnection.transaction()
        try {
            await PlayModel.updatePlay(trx, idPlay, payload)
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
