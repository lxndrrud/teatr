import { Response } from "express"
import { EventEmitter } from "stream"
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors";
import { SlotIsReservedInterface } from "../interfaces/slots"
import { ISessionCRUDService } from "../services/sessions/SessionCRUD.service";

export interface ISlotsEventEmitter {
    connectSession(idSession: number, res: Response): void

    emitSession(idSession: number): void
}

export class SlotsEventEmitter implements ISlotsEventEmitter {
    static instance: SlotsEventEmitter
    protected eventEmitter
    protected sessionCRUDService

    constructor(
        sessionCRUDServiceInstance: ISessionCRUDService
    ) {
        this.eventEmitter = new EventEmitter()
        SlotsEventEmitter.instance = this
        this.sessionCRUDService = sessionCRUDServiceInstance
    }

    public static getInstance(
        sessionCRUDServiceInstance: ISessionCRUDService
    ) {
        if (SlotsEventEmitter.instance) return SlotsEventEmitter.instance
        else return new SlotsEventEmitter(
            sessionCRUDServiceInstance
        )
    }

    public connectSession(idSession: number, res: Response) {
        this.eventEmitter.once(`getSlots-${idSession}`, (idSession: number) => {
            this.sessionCRUDService.getSlots(idSession)
            .then(result => {
                if (isInnerErrorInterface(result)) {
                    res.status(result.code).send(result.message)
                    return
                }
                res.status(200).send(result)
            })
            .catch(e => { res.status(500).send(<ErrorInterface>{
                message: e
            }) })
            
        })
    }

    public emitSession(idSession: number) {
        this.eventEmitter.emit(`getSlots-${idSession}`, idSession)
    }
}