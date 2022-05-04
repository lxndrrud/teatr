import { Request, Response } from "express"
import { SessionBaseInterface, SessionInterface, SessionFilterQueryInterface, isSessionBaseInterface, isSessionFilterQueryInterface } 
    from "../interfaces/sessions"
import { SessionService } from "../fetchingModels/sessions"
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors"


export class SessionController {
    private sessionService
    constructor(sessionServiceInstance: SessionService) {
        this.sessionService = sessionServiceInstance
    }

    async getSessions(req: Request, res: Response) {
        const query = await this.sessionService.getUnlockedSessions()
        if (isInnerErrorInterface(query)) {
            res.status(query.code).send(<ErrorInterface>{
                message: query.message
            })
            return
        }
        res.status(200).send(query)
    }

    async getSingleSession(req: Request, res: Response) {
        const idSession = parseInt(req.params.idSession)
        if (!idSession) {
            res.status(400).end()
            return 
        }
        const query = await this.sessionService.getSingleUnlockedSession(idSession)
        if (isInnerErrorInterface(query)) {
            res.status(query.code).send(<ErrorInterface>{
                message: query.message
            })
            return
        }
        res.status(200).send(query)
    }

    async postSession(req: Request, res: Response) {
        if (!isSessionBaseInterface(req.body)) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        const payload: SessionBaseInterface = {...req.body}
        const newSession = await this.sessionService.createSession(payload)
        if (isInnerErrorInterface(newSession)) {
            res.status(newSession.code).send(<ErrorInterface>{
                message: newSession.message
            })
            return
        }
        res.status(201).send({
            id: newSession.id
        })
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
        
        const response = await this.sessionService.updateSession(idSession, payload)
        if (isInnerErrorInterface(response)) {
            res.status(response.code).send(<ErrorInterface>{
                message: response.message
            })
            return
        }
        res.status(200).end()
    }

    async deleteSession(req: Request, res: Response) {
        const idSession = parseInt(req.params.idSession)
        if (!idSession) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        const response = await this.sessionService.deleteSession(idSession)
    
        if (isInnerErrorInterface(response)) {
            res.status(response.code).send(<ErrorInterface>{
                message: response.message
            })
            return
        }
    
        res.status(200).end()
    }

    async getSessionsByPlay(req: Request, res: Response) {
        const idPlay = parseInt(req.params.idPlay)
        if (!idPlay) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return 
        }
        
        const query = await this.sessionService.getSessionsByPlay(idPlay)
    
        if (isInnerErrorInterface(query)) {
            res.status(query.code).send(<ErrorInterface>{
                message: query.message
            })
            return
        }
    
        res.status(200).send(query)
    }

    async getSlotsForSessions(req: Request, res: Response) {
        const idSession = parseInt(req.params.idSession)
        if (!idSession) {
            res.status(400).end()
            return
        }
        const result = await this.sessionService.getSlots(idSession)
    
        if (isInnerErrorInterface(result)) {
            res.status(result.code).send(<ErrorInterface>{
                message: result.message
            })
            return
        }
    
        res.status(200).send(result)
    }

    async getFilteredSessions(req: Request, res: Response) {
        if (!isSessionFilterQueryInterface(req.query)) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        const userQuery: SessionFilterQueryInterface = {...req.query}
    
        const query = await this.sessionService.getFilteredSessions(userQuery)
    
        if (isInnerErrorInterface(query)) {
            res.status(query.code).send(<ErrorInterface>{
                code: query.code,
                message: query.message
            })
            return
        }
    
        res.status(200).send(query)
    }

    async getSessionFilterOptions(req: Request, res: Response) {
        const query = await this.sessionService.getSessionFilterOptions()
    
        if (isInnerErrorInterface(query)) {
            res.status(query.code).send(<ErrorInterface>{
                message: query.message
            })
            return
        }
    
        res.status(200).send(query)
    }

}
