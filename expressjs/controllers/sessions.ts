import { Request, Response } from "express"
import { SessionBaseInterface,  SessionFilterQueryInterface, isSessionBaseInterface, isSessionFilterQueryInterface } 
    from "../interfaces/sessions"
import { ErrorInterface } from "../interfaces/errors"
import { UploadedFile } from "express-fileupload"
import { ISessionCRUDService } from "../services/sessions/SessionCRUD.service"
import { ISessionCSVService } from "../services/sessions/SessionCSV.service"
import { ISessionFilterService } from "../services/sessions/SessionFilter.service"
import { ISlotsEventEmitter } from "../events/SlotsEmitter"
import { IErrorHandler } from "../utils/ErrorHandler"


export class SessionController {
    private sessionCRUDService
    private sessionCSVService
    private sessionFilterService
    private slotsEventEmitter
    private errorHandler

    constructor(
        sessionCRUDServiceInstance: ISessionCRUDService,
        sessionCSVServiceInstance: ISessionCSVService,
        sessionFilterService: ISessionFilterService,
        slotsEventEmitterInstance: ISlotsEventEmitter,
        errorHandlerInstance: IErrorHandler
    ) {
        this.sessionCRUDService = sessionCRUDServiceInstance
        this.sessionCSVService = sessionCSVServiceInstance
        this.sessionFilterService = sessionFilterService
        this.slotsEventEmitter = slotsEventEmitterInstance
        this.errorHandler = errorHandlerInstance
    }

    async getSessions(req: Request, res: Response) {
        try {
            const query = await this.sessionCRUDService.getUnlockedSessions()
            res.status(200).send(query)
        } catch(error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async getSingleSession(req: Request, res: Response) {
        const idSession = parseInt(req.params.idSession)
        if (!idSession) {
            res.status(400).end()
            return 
        }
        try {
            const query = await this.sessionCRUDService.getSingleUnlockedSession(idSession)
            res.status(200).send(query)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async postSession(req: Request, res: Response) {
        if (!isSessionBaseInterface(req.body)) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        const payload: SessionBaseInterface = {...req.body}
        try {
            await this.sessionCRUDService.createSession(payload)
            res.status(201).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async createSessionsCSV(req: Request, res: Response) {
        if (!req.files) {
            res.status(400).send(<ErrorInterface>{
                message: "Запрос без прикрепленного csv-файла!"
            })
            return
        }
        try {
            await this.sessionCSVService.createSessionsCSV(<UploadedFile> req.files.csv)
            res.status(201).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async updateSession(req: Request, res: Response) {
        const idSession = parseInt(req.params.idSession)
        if (!idSession) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        if (!isSessionBaseInterface(req.body)) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        const payload: SessionBaseInterface = {...req.body}
        try {
            await this.sessionCRUDService.updateSession(idSession, payload)
            res.status(200).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async deleteSession(req: Request, res: Response) {
        const idSession = parseInt(req.params.idSession)
        if (!idSession) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        try {
            await this.sessionCRUDService.deleteSession(idSession)
            res.status(200).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async getSessionsByPlay(req: Request, res: Response) {
        const idPlay = parseInt(req.params.idPlay)
        if (!idPlay) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return 
        }
        try {
            const query = await this.sessionCRUDService.getSessionsByPlay(idPlay)
            res.status(200).send(query)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async getSlotsLongPolling(req: Request, res: Response) {
        const idSession = parseInt(req.params.idSession)
        if (!idSession) {
            res.status(400).send(<ErrorInterface>{
                message: 'Идентификатор сеанса не распознан!'
            })
            return
        }
        this.slotsEventEmitter.connectSession(idSession, res)
    }

    async getSlotsForSessions(req: Request, res: Response) {
        const idSession = parseInt(req.params.idSession)
        if (!idSession) {
            res.status(400).send(<ErrorInterface>{
                message: 'Идентификатор сеанса не распознан!'
            })
            return
        }
        try {
            const result = await this.sessionCRUDService.getSlots(idSession)
            res.status(200).send(result)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async getFilteredSessions(req: Request, res: Response) {
        if (!isSessionFilterQueryInterface(req.query)) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        const userQuery: SessionFilterQueryInterface = {...req.query}
    
        try {
            const query = await this.sessionFilterService.getFilteredSessions(userQuery)
            res.status(200).send(query)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    async getSessionFilterOptions(req: Request, res: Response) {
        try {
            const query = await this.sessionFilterService.getSessionFilterOptions()
            res.status(200).send(query)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

}
