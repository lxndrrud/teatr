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
        this.eventEmitter.on(`getSlots-${idSession}`, async (idSession: number) => {
            try {
                console.log('on')
                const result = await this.sessionCRUDService.getSlots(idSession)
                if (isInnerErrorInterface(result)) {
                    res.end()
                    return
                }
                res.write(`data:${result}\n\n`)
            } catch(e) {
                console.log(e)
            }
            
        })
    }

    public emitSession(idSession: number) {
        this.eventEmitter.emit(`getSlots-${idSession}`, idSession)
    }
}