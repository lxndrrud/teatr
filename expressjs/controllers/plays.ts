import { KnexConnection }from "../knex/connections"
import { Request, Response } from "express"
import * as PlayModel from "../models/plays"
import { PlayFetchingInstance } from "../fetchingModels/plays"
import { isPlayBaseInterface, PlayBaseInterface, PlayInterface } from "../interfaces/plays"
import { ErrorInterface } from "../interfaces/errors"

export const getPlays = async (req: Request, res: Response) => {
    try {
        const query = await PlayFetchingInstance.getAll({})
        res.status(200).send(query)
    } catch (e) {
        res.status(500).send(<ErrorInterface>{
            message: 'Внутренняя ошибка сервера!'
        })
    }
}

export const createPlay = async (req: Request, res: Response) => {
    if(!isPlayBaseInterface(req.body)) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    const payload: PlayBaseInterface = {...req.body}
    const newPlay = await PlayFetchingInstance.createPlay(payload)
    if (newPlay === 500) {
        res.status(500).send(<ErrorInterface>{
            message: 'Внутренняя ошибка сервера!'
        })
        return
    }
    res.status(201).send({
        id: newPlay.id
    })
}

export const getSinglePlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    if (!idPlay) {
        res.status(400).end()
        return 
    }
    const query = await PlayFetchingInstance.getSinglePlay({ id: idPlay })
    if (query === 404) {
        res.status(404).end()
        return
    }
    res.status(200).send(query)

}
    

export const deletePlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    if (!idPlay) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    const responseCode = await PlayFetchingInstance.deletePlay(idPlay)
    if (responseCode === 200) {
        res.status(200).end()
    }
    else if (responseCode === 404) {
        res.status(404).send(<ErrorInterface>{
            message: 'Запись не найдена!'
        })
    }
    else if (responseCode === 500) {
        res.status(500).send(<ErrorInterface>{
            message: 'Внутрення ошибка сервера!'
        })
    }
}

export const updatePlay = async (req: Request, res: Response) => {
    const idPlay = parseInt(req.params.idPlay)
    if (!idPlay) {
        res.send(400).end()
        return
    }
    if (!isPlayBaseInterface(req.body)) {
        res.status(400).send({
            message: 'Неверное тело запроса!'
        })
        return
    }
    const payload: PlayBaseInterface = {...req.body}
    const responseCode = await PlayFetchingInstance.updatePlay(idPlay, payload)
    if (responseCode === 200) {
        res.status(200).end()
    }
    else if (responseCode === 404) {
        res.status(404).send(<ErrorInterface>{
            message: 'Запись не найдена!'
        })
    }
    else if (responseCode === 500) {
        res.status(500).send(<ErrorInterface>{
            message: 'Внутренняя ошибка сервера!'
        })
    }
}
