import { KnexConnection }from "../knex/connections"
import { Request, Response } from "express"
import * as PlayModel from "../models/plays"
import { PlayFetchingModel } from "../fetchingModels/plays"
import { PlayBaseInterface, PlayInterface } from "../interfaces/plays"
import { ErrorInterface } from "../interfaces/errors"

export const getPlays = async (req: Request, res: Response) => {
    try {
        const query = await PlayFetchingModel.getAll({})
        res.status(200).send(query)
    } catch (e) {
        res.status(500).send(<ErrorInterface>{
            message: 'Внутренняя ошибка сервера!'
        })
    }
}

export const createPlay = async (req: Request, res: Response) => {
    try {
        const payload: PlayBaseInterface = {...req.body}
        const trx = await KnexConnection.transaction()
        try {
            const newPlay = (await PlayFetchingModel.insert(trx, payload))[0]
            await trx.commit()
            res.status(201).send({
                id: newPlay.id
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

export const getSinglePlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    if (!idPlay) {
        res.status(400).end()
        return 
    }
    const query = await PlayFetchingModel.get({id: idPlay})
    if (!query) {
        res.status(404).end()
        return
    }
    res.status(200).send(query)

}
    

export const deletePlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    const query = await PlayFetchingModel.get({id: idPlay})
    if (!query) {
        res.status(404).end()
        return
    }
    const trx = await KnexConnection.transaction()
    try {
        await PlayFetchingModel.delete(trx, idPlay)
        await trx.commit()
        res.status(200).end()
    }
    catch (e) {
        await trx.rollback()
        console.log(e)
        res.status(500).end()
    }
}

export const updatePlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    if (!idPlay) {
        res.send(400).end()
        return
    }
    const payload: PlayBaseInterface = {...req.body}
    const query = await PlayFetchingModel.get({id: idPlay})
    if (!query) { 
        res.status(404).end()
        return 
    }
    const trx = await KnexConnection.transaction()
    try {
        await PlayFetchingModel.update(trx, idPlay, payload)
        await trx.commit()
    }
    catch (e) {
        await trx.rollback()
        console.log(e)
        res.status(500).end()
    }
}
