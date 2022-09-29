import Redis from "ioredis";
import { PlayWithPosterInterface } from "../interfaces/plays";


export interface IPlayRedisRepo {
    getUnlockedPlays(): Promise<PlayWithPosterInterface[] | null>
    setUnlockedPlays(plays: PlayWithPosterInterface[]): Promise<void>
    clearUnlockedPlays(): Promise<void>

    setUnlockedPlay(idPlay: number, play: PlayWithPosterInterface): Promise<void>
    getUnlockedPlay(idPlay: number): Promise<PlayWithPosterInterface | null>
    clearUnlockedPlay(idPlay: number): Promise<void>
}

export class PlayRedisRepo implements IPlayRedisRepo {
    private connection

    constructor(
        redisConnection: Redis
    ) {
        this.connection = redisConnection
    }

    /*
    Для всех открытых спектаклей unlocked-plays  
    */
    public async getUnlockedPlays() {
        const playsString = await this.connection.get('unlocked-plays')
        if (!playsString) return null
        return <PlayWithPosterInterface[]> JSON.parse(playsString)
    }

    public async setUnlockedPlays(plays: PlayWithPosterInterface[]) {
        await this.connection.set('unlocked-plays', JSON.stringify(plays))
    }

    public async clearUnlockedPlays() {
        await this.connection.del('unlocked-plays')
    }

    /*
    Для открытых спектаклей по одиночке строк `play-{idPlay}`
    */
    public async setUnlockedPlay(idPlay: number, play: PlayWithPosterInterface) {
        await this.connection.set(`play-${idPlay}`, JSON.stringify(play))
    }

    public async getUnlockedPlay(idPlay: number) {
        const playString = await this.connection.get(`play-${idPlay}`)
        if (!playString) return null
        return <PlayWithPosterInterface> JSON.parse(playString)
    }

    public async clearUnlockedPlay(idPlay: number) {
        await this.connection.del(`play-${idPlay}`)
    }
}