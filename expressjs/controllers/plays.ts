import { KnexConnection }from "../knex/connections"
import { Request, Response } from "express"
import { PlayFetchingInstance } from "../fetchingModels/plays"
import { isPlayBaseInterface, PlayBaseInterface, PlayInterface } from "../interfaces/plays"
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors"

export const getPlays = async (req: Request, res: Response) => {
    const query = await PlayFetchingInstance.getAll()
    if (isInnerErrorInterface(query)) {
        res.status(query.code).send(<ErrorInterface>{
            message: query.message
        })
        return 
    }
    res.status(200).send(query)
}

export const createPlay = async (req: Request, res: Response) => {
    // Проверка тела запроса
    if(!isPlayBaseInterface(req.body)) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    const payload: PlayBaseInterface = {...req.body}

    // Создание записи спектакля
    const newPlay = await PlayFetchingInstance.createPlay(payload)

    if (isInnerErrorInterface(newPlay)) {
        res.status(newPlay.code).send(<ErrorInterface>{
            message: newPlay.message
        })
        return
    }
    
    res.status(201).send({
        id: newPlay.id
    })
}

export const getSinglePlay = async (req: Request, res: Response) => {
    // Проверка строки запроса
    if (!req.params.idPlay) {
        res.status(400).end()
        return 
    }
    const idPlay = parseInt(req.params.idPlay)
    
    const query = await PlayFetchingInstance.getSinglePlay(idPlay)
    if (isInnerErrorInterface(query)) {
        res.status(query.code).send(<ErrorInterface>{
            message: query.message
        })
        return
    }
    res.status(200).send(query)
}
    

export const deletePlay = async (req: Request, res: Response) => {
    // Проверка строки запроса
    if (!req.params.idPlay) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    const idPlay = parseInt(req.params.idPlay)

    const response = await PlayFetchingInstance.deletePlay(idPlay)

    if(isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }

    res.sendStatus(200).end()
}

export const updatePlay = async (req: Request, res: Response) => {
    // Проверка строки запроса
    if (!req.params.idPlay) {
        res.sendStatus(400).end()
        return
    }
    const idPlay = parseInt(req.params.idPlay)

    // Проверка тела запроса
    if (!isPlayBaseInterface(req.body)) {
        res.status(400).send({
            message: 'Неверное тело запроса!'
        })
        return
    }
    const payload: PlayBaseInterface = {...req.body}

    // Обновление спектакля
    const response = await PlayFetchingInstance.updatePlay(idPlay, payload)

    if(isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }

    res.sendStatus(200).end()
}
