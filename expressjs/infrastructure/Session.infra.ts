import { SessionModel } from "../dbModels/sessions"
import { InnerErrorInterface } from "../interfaces/errors"
import { SessionInterface } from "../interfaces/sessions"
import { SlotInterface, SlotIsReservedInterface, SlotWithRowIdInterface } from "../interfaces/slots"
import { TimestampHelper } from "../utils/timestamp"


export interface ISessionInfrastructure {
    fixTimestamps(query: SessionInterface[]): SessionInterface[]

    getReservedSlots(idReservation: number, idPricePolicy: number): 
    Promise<SlotInterface[] | InnerErrorInterface>
}

export class SessionInfrastructure implements ISessionInfrastructure {
    protected sessionModel
    protected timestampHelper

    constructor(
        sessionModelInstance: SessionModel,
        timestampHelperInstance: TimestampHelper
    ) {
        this.sessionModel = sessionModelInstance
        this.timestampHelper = timestampHelperInstance
    }

    public fixTimestamps(query: SessionInterface[]) {
        const resultList: SessionInterface[] = []
        for (let session of query) {
            session.timestamp = this.timestampHelper.extendedTimestamp(session.timestamp)
        }
        return query
    }

    public async getReservedSlots(idReservation: number, idPricePolicy: number) {
        try {
            const query: SlotInterface[] = await this.sessionModel
                .getReservedSlots(idReservation, idPricePolicy)
            return query
        } catch(e) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
    }
}