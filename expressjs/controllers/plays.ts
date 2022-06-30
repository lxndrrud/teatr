import { KnexConnection }from "../knex/connections"
import { Request, Response } from "express"
import { PlayFetchingModel, PlayService } from "../fetchingModels/plays"
import { PlayDatabaseModel } from "../dbModels/plays"
import { isPlayBaseInterface, PlayBaseInterface, PlayInterface } from "../interfaces/plays"
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors"
import csv from "csv-parser"
import { UploadedFile } from "express-fileupload"

export class PlayController {
    private playService
    constructor(playService: PlayService) {
        this.playService = playService
    }

    async getPlays(req: Request, res: Response ) {
        const query = await this.playService.getAll()
        if (isInnerErrorInterface(query)) {
            res.status(query.code).send(<ErrorInterface>{
                message: query.message
            })
            return 
        }
        res.status(200).send(query)
    }

    async createPlay(req: Request, res: Response) {
        // Проверка тела запроса
        if(!isPlayBaseInterface(req.body)) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        const payload: PlayBaseInterface = {...req.body}
    
        // Создание записи спектакля
        const newPlay = await this.playService.createPlay(payload)
    
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

    async getSinglePlay(req: Request, res: Response) {
        // Проверка строки запроса
        if (!req.params.idPlay) {
            res.status(400).end()
            return 
        }
        const idPlay = parseInt(req.params.idPlay)
        
        const query = await this.playService.getSinglePlay(idPlay)
        if (isInnerErrorInterface(query)) {
            res.status(query.code).send(<ErrorInterface>{
                message: query.message
            })
            return
        }
        res.status(200).send(query)
    }

    async deletePlay(req: Request, res: Response) {
        // Проверка строки запроса
        if (!req.params.idPlay) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        const idPlay = parseInt(req.params.idPlay)
    
        const response = await this.playService.deletePlay(idPlay)
    
        if(isInnerErrorInterface(response)) {
            res.status(response.code).send(<ErrorInterface>{
                message: response.message
            })
            return
        }
    
        res.sendStatus(200).end()
    }

    async updatePlay(req: Request, res: Response) {
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
        const response = await this.playService.updatePlay(idPlay, payload)
    
        if(isInnerErrorInterface(response)) {
            res.status(response.code).send(<ErrorInterface>{
                message: response.message
            })
            return
        }
    
        res.sendStatus(200).end()
    }

    /**
     * Загрузка спектаклей CSV
     */
    async createPlaysCSV(req: Request, res: Response) {
        if (!req.files) { 
            res.status(400).send(<ErrorInterface>{
                message: "Запрос без прикрепленного csv-файла!"
            })
            return
        }
        /*
        if (!req.user) {
            res.status(401).send(<ErrorInterface>{
                message: "Неавторизованный запрос!"
            })
            return
        }
        */
        
        const response = await this.playService
            .createPlaysCSV(<UploadedFile>req.files.csv)
        if (isInnerErrorInterface(response)) {
            res.status(response.code).send(<ErrorInterface>{
                message: response.message
            })
            return
        }
        res.status(201).end()
    }
}

