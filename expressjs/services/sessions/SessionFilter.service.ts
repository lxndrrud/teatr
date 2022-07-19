import { SessionModel } from "../../dbModels/sessions"
import { ISessionInfrastructure } from "../../infrastructure/Session.infra"
import { AuditoriumSessionFilterOption } from "../../interfaces/auditoriums"
import { InnerErrorInterface } from "../../interfaces/errors"
import { PlaySessionFilterOptionInterface } from "../../interfaces/plays"
import { SessionFilterQueryInterface, SessionInterface } from "../../interfaces/sessions"
import { TimestampSessionFilterOptionDatabaseInterface, TimestampSessionFilterOptionInterface } from "../../interfaces/timestamps"
import { TimestampHelper } from "../../utils/timestamp"

export interface ISessionFilterService {
    getSessionFilterOptions(): 
    Promise<InnerErrorInterface | {
        dates: TimestampSessionFilterOptionInterface[];
        auditoriums: AuditoriumSessionFilterOption[];
        plays: PlaySessionFilterOptionInterface[];
    }>

    getFilteredSessions(userQueryPayload: SessionFilterQueryInterface): 
    Promise<SessionInterface[] | InnerErrorInterface>
}

export class SessionFilterService {
    protected sessionModel
    protected sessionInfrastructure
    protected timestampHelper

    constructor(
        sessionModelInstance: SessionModel,
        sessionInfrastructureInstance: ISessionInfrastructure,
        timestampHelperInstance: TimestampHelper
    ) {
        this.sessionModel = sessionModelInstance
        this.sessionInfrastructure = sessionInfrastructureInstance
        this.timestampHelper = timestampHelperInstance
    }

    public async getSessionFilterOptions() {
        let timestamps: TimestampSessionFilterOptionDatabaseInterface[],
            auditoriums: AuditoriumSessionFilterOption[],
            plays: PlaySessionFilterOptionInterface[]
        try {
            [timestamps, auditoriums, plays] = await Promise.all([
                this.sessionModel.getSessionFilterTimestamps(),
                this.sessionModel.getSessionFilterAuditoriums(),
                this.sessionModel.getSessionFilterPlays()
            ])
        } catch (e) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске значений для фильтра!'
            }
        }
        
    
        let dates: TimestampSessionFilterOptionInterface[] = []
        let distinctCheck: Map<string, string> = new Map()
        for (let row of timestamps) {
            const extendedDate = this.timestampHelper.extendedDateFromTimestamp(row.timestamp)
            const simpleDate = this.timestampHelper.dateFromTimestamp(row.timestamp)
            if (!distinctCheck.has(simpleDate)) {
                dates.push({
                    date: simpleDate,
                    extended_date: extendedDate
                })
                distinctCheck.set(simpleDate, simpleDate)
            }
        }

        return {
            dates,
            auditoriums,
            plays
        }
    }

    public async getFilteredSessions(userQueryPayload: SessionFilterQueryInterface) {
        try {
            const query: SessionInterface[] = await this.sessionModel
                .getFilteredSessions(userQueryPayload)
            const fetchedQuery = this.sessionInfrastructure.fixTimestamps(query)
            return fetchedQuery
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске отфильтрованных сеансов!'
            }
        }
        
    }
}