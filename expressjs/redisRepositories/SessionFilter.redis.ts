import Redis from "ioredis";
import { SessionFilterQueryInterface, SessionInterface } from "../interfaces/sessions";

export interface ISessionFilterRedisRepo {
    setFilteredSessions(sessionQuery: SessionFilterQueryInterface, sessions: SessionInterface[]): Promise<void>
    getFilteredSessions(sessionQuery: SessionFilterQueryInterface): Promise<SessionInterface[] | null>
    clearFilteredSessions(): Promise<void>
}

export class SessionFilterRedisRepo implements ISessionFilterRedisRepo {
    private connection
    private sessionFilterString = 'sessionFilter'
    
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
    }

    public async getFilteredSessions(sessionQuery: SessionFilterQueryInterface) {
        const sessionsString = await this.connection.hget(this.sessionFilterString, this.parseSessionQueryInterface(sessionQuery))
        if (!sessionsString) return null
        return <SessionInterface[]> JSON.parse(sessionsString)
    }

    public async clearFilteredSessions() {
        await this.connection.del(this.sessionFilterString)
    }
}