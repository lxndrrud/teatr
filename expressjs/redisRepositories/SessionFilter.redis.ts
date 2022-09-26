import Redis from "ioredis";
import { SessionFilterQueryInterface, SessionInterface } from "../interfaces/sessions";

export interface ISessionFilterRedisRepo {
    setFilteredSessions(sessionQuery: SessionFilterQueryInterface, sessions: SessionInterface[]): Promise<void>
    getFilteredSessions(sessionQuery: SessionFilterQueryInterface): Promise<SessionInterface[] | null>
    clearFilteredSession(idSession: number): Promise<void>
}

export class SessionFilterRedisRepo implements ISessionFilterRedisRepo {
    private connection
    private sessionFilterString = 'sessionFilter'
    private sessionFilterReverseString = 'sessionFilterReverse'
    
    constructor(
        redisConnection: Redis
    ) {
        this.connection = redisConnection
    }

    private parseSessionQueryInterface(sessionQuery: SessionFilterQueryInterface) {
        return `${sessionQuery.dateFrom}_${sessionQuery.dateTo}_${sessionQuery.auditorium_title}_${sessionQuery.play_title}`
    }

    public async setFilteredSessions(sessionQuery: SessionFilterQueryInterface, sessions: SessionInterface[]) {
        const preparedQuery = this.parseSessionQueryInterface(sessionQuery)
        await this.connection.hset(this.sessionFilterString, 
            preparedQuery, JSON.stringify(sessions))
        for (const session of sessions) {
            await this.connection.hset(this.sessionFilterReverseString, `session-${session.id}`, preparedQuery)
        }
    }

    public async getFilteredSessions(sessionQuery: SessionFilterQueryInterface) {
        const sessionsString = await this.connection.hget(this.sessionFilterString, this.parseSessionQueryInterface(sessionQuery))
        if (!sessionsString) return null
        return <SessionInterface[]> JSON.parse(sessionsString)
    }

    public async clearFilteredSession(idSession: number) {
        const queryPayloads = await this.connection.hmget(this.sessionFilterReverseString, `session-${idSession}`)
        for (const payload of queryPayloads) {
            if (payload) await this.connection.hdel(this.sessionFilterString, payload)
        }
    }
}