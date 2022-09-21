import { Response } from "express"
import { EventEmitter } from "stream"
import { ISessionCRUDService } from "../services/sessions/SessionCRUD.service";
import { IErrorHandler } from "../utils/ErrorHandler";

export interface ISlotsEventEmitter {
    connectSession(idSession: number, res: Response): void

    emitSession(idSession: number): void
}

export class SlotsEventEmitter implements ISlotsEventEmitter {
    static instance: SlotsEventEmitter
    protected eventEmitter
    protected sessionCRUDService
    protected errorHandler

    constructor(
        sessionCRUDServiceInstance: ISessionCRUDService,
        errorHandlerInstance: IErrorHandler
    ) {
        this.eventEmitter = new EventEmitter()
        SlotsEventEmitter.instance = this
        this.sessionCRUDService = sessionCRUDServiceInstance
        this.errorHandler = errorHandlerInstance
    }

    public static getInstance(
        sessionCRUDServiceInstance: ISessionCRUDService,
        errorHandlerInstance: IErrorHandler
    ) {
        if (SlotsEventEmitter.instance) return SlotsEventEmitter.instance
        else return new SlotsEventEmitter(
            sessionCRUDServiceInstance,
            errorHandlerInstance
        )
    }

    public connectSession(idSession: number, res: Response) {
        this.eventEmitter.once(`getSlots-${idSession}`, (idSession: number) => {
            this.sessionCRUDService.getSlots(idSession)
            .then(result => {
                res.status(200).send(result)
            })
            .catch(error => this.errorHandler.fetchError(res, error))
        })
    }

    public emitSession(idSession: number) {
        this.eventEmitter.emit(`getSlots-${idSession}`, idSession)
    }
}