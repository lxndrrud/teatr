import { Request, Response } from "express"
import { IPlayService } from "../services/plays/PlayService"
import { isPlayBaseInterface, PlayBaseInterface } from "../interfaces/plays"
import { ErrorInterface } from "../interfaces/errors"
import { UploadedFile } from "express-fileupload"
import { IErrorHandler } from "../utils/ErrorHandler"

export class PlayController {
    private playService
    private errorHandler

    constructor(
        playServiceInstance: IPlayService,
        errorHandlerInstance: IErrorHandler
    ) {
        this.playService = playServiceInstance
        this.errorHandler = errorHandlerInstance
    }

    async getPlays(req: Request, res: Response ) {
        try {
            const query = await this.playService.getAll()
            res.status(200).send(query)

        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
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
        try {
            await this.playService.createPlay(payload)
            res.status(201).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async getSinglePlay(req: Request, res: Response) {
        // Проверка строки запроса
        if (!req.params.idPlay) {
            res.status(400).send(<ErrorInterface> {
                message: 'Не указан идентификатор спектакля'
            })
            return 
        }
        const idPlay = parseInt(req.params.idPlay)
        if (!idPlay) {
            res.status(400).send(<ErrorInterface> {
                message: 'Неверный идентификатор спектакля!'
            })
            return
        }
        try {
            const query = await this.playService.getSinglePlay(idPlay)
            res.status(200).send(query)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
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
        if (!idPlay) {
            res.status(400).send(<ErrorInterface> {
                message: 'Неверный идентификатор спектакля!'
            })
            return
        }
        try {
            await this.playService.deletePlay(idPlay)
            res.sendStatus(200).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async updatePlay(req: Request, res: Response) {
        // Проверка строки запроса
        if (!req.params.idPlay) {
            res.sendStatus(400).end()
            return
        }
        const idPlay = parseInt(req.params.idPlay)
        if (!idPlay) {
            res.status(400).send(<ErrorInterface> {
                message: 'Неверный идентификатор спектакля!'
            })
            return
        }
        // Проверка тела запроса
        if (!isPlayBaseInterface(req.body)) {
            res.status(400).send({
                message: 'Неверное тело запроса!'
            })
            return
        }
        const payload: PlayBaseInterface = {...req.body}
        // Обновление спектакля
        try {
            await this.playService.updatePlay(idPlay, payload)
            res.sendStatus(200).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
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
        try {
            await this.playService.createPlaysCSV(<UploadedFile>req.files.csv)
            res.status(201).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)            
        }
    }
}

