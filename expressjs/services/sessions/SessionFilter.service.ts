import { ISessionFilterPreparator } from "../../infrastructure/SessionFilterPreparator.infra"
import { ISessionPreparator } from "../../infrastructure/SessionPreparator.infra"
import { AuditoriumSessionFilterOption } from "../../interfaces/auditoriums"
import { PlaySessionFilterOptionInterface } from "../../interfaces/plays"
import { SessionFilterQueryInterface, SessionInterface } from "../../interfaces/sessions"
import { ISessionRepo } from "../../repositories/Session.repo"
import { TimestampHelper } from "../../utils/timestamp"

export interface ISessionFilterService {
    getSessionFilterOptions(): Promise<{
        auditoriums: AuditoriumSessionFilterOption[];
        plays: PlaySessionFilterOptionInterface[];
    }>

    getFilteredSessions(userQueryPayload: SessionFilterQueryInterface): Promise<SessionInterface[]>
}

export class SessionFilterService implements ISessionFilterService {
    protected sessionRepo
    protected sessionPreparator
    protected timestampHelper
    protected sessionFilterPreparator

    constructor(
        sessionRepoInstance: ISessionRepo,
        sessionPreparatorInstance: ISessionPreparator,
        timestampHelperInstance: TimestampHelper,
        sessionFilterPreparatorInstance: ISessionFilterPreparator
    ) {
        this.sessionRepo = sessionRepoInstance
        this.sessionPreparator = sessionPreparatorInstance
        this.timestampHelper = timestampHelperInstance
        this.sessionFilterPreparator = sessionFilterPreparatorInstance
    }

    public async getSessionFilterOptions() {
        const [ auditoriums, plays ] = await Promise.all([
            this.sessionRepo.getSessionFilterAuditoriums(),
            this.sessionRepo.getSessionFilterPlays()
        ])

        return {
            auditoriums: this.sessionFilterPreparator.prepareAuditoriumTitles(auditoriums) ,
            plays: this.sessionFilterPreparator.preparePlayTitles(plays)
        }
    }

    public async getFilteredSessions(userQueryPayload: SessionFilterQueryInterface) {
        const sessions = await this.sessionRepo.getFilteredSessions(userQueryPayload)
        return sessions.map(session => this.sessionPreparator.prepareSession(session))
    }
}