import Redis from "ioredis";
import { SessionFilterQueryInterface, SessionInterface } from "../interfaces/sessions";


export interface ISessionRedisRepo {
    setSession(idSession: number, session: SessionInterface): Promise<void>
    getSession(idSession: number): Promise<SessionInterface | null>
    clearSession(idSession: number): Promise<void>
}

export class SessionRedisRepo implements ISessionRedisRepo {
    private connection
    private sessionString = 'session'

    constructor(
        redisConnection: Redis
    ) {
        this.connection = redisConnection
    }

    public async setSession(idSession: number, session: SessionInterface) {
        await this.connection.set(`${this.sessionString}-${idSession}`, JSON.stringify(session))
    }

    public async getSession(idSession: number) {
        const sessionString = await this.connection.get(`${this.sessionString}-${idSession}`)
        if (!sessionString) return null
        return <SessionInterface> JSON.parse(sessionString)
    }

    public async clearSession(idSession: number) {
        await this.connection.del(`${this.sessionString}-${idSession}`)
    }

}