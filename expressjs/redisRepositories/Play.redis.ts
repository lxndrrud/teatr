import Redis from "ioredis";
import { PlayWithPosterInterface } from "../interfaces/plays";


export interface IPlayRedisRepo {
    setPlay(idPlay: number, play: PlayWithPosterInterface): Promise<void>
    getPlay(idPlay: number): Promise<PlayWithPosterInterface | null>
    clearPlay(idPlay: number): Promise<void>
}

export class PlayRedisRepo implements IPlayRedisRepo {
    private connection

    constructor(
        redisConnection: Redis
    ) {
        this.connection = redisConnection
    }

    public async setPlay(idPlay: number, play: PlayWithPosterInterface) {
        await this.connection.set(`play-${idPlay}`, JSON.stringify(play))
    }

    public async getPlay(idPlay: number) {
        const playString = await this.connection.get(`play-${idPlay}`)
        if (!playString) return null
        console.log(playString)
        return <PlayWithPosterInterface> JSON.parse(playString)
    }

    public async clearPlay(idPlay: number) {
        await this.connection.del(`play-${idPlay}`)
    }
}