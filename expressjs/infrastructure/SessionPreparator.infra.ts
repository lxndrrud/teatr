import { Session } from "../entities/sessions";
import { SessionInterface } from "../interfaces/sessions";
import { TimestampHelper } from "../utils/timestamp";

export interface ISessionPreparator {
    fetchSession(session: Session): SessionInterface
    fetchSessions(sessions: Session[]): Promise<SessionInterface[]>
}

export class SessionPreparator implements ISessionPreparator {
    private timestampHelper

    constructor(
        timestampHelperInstance: TimestampHelper
    ) {
        this.timestampHelper= timestampHelperInstance
    }

    public fetchSession(session: Session) {
        return <SessionInterface> {
            id: session.id,
            id_play: session.play.id,
            id_price_policy: session.pricePolicy.id,
            max_slots: session.maxSlots,
            is_locked: session.isLocked,
            timestamp: this.timestampHelper.extendedTimestamp(session.timestamp),

            play_title: session.play.title,
            auditorium_title: session.pricePolicy.slots[0].seat.row.auditorium.title,
            poster_filepath: session.play.playImages[0].image.filepath
        }
    }
    public async fetchSessions(sessions: Session[]) {
        const resultList: SessionInterface[] = []
        for (const session of sessions) {
            resultList.push(this.fetchSession(session))
        }
        return resultList
    }
}