import { DataSource } from "typeorm";
import { Play } from "../entities/plays";
import { PlayBaseInterface } from "../interfaces/plays";

export interface IPlayRepo {
    filterPlays(title: string): Promise<Play[]>
    getSingle(idPlay: number): Promise<Play | null>
    getAll(): Promise<Play[]>
    createPlay(payload: PlayBaseInterface): Promise<void>
    createPlays(payload: PlayBaseInterface[]): Promise<void>
    deletePlay(idPlay: number): Promise<void>
}

export class PlayRepo implements IPlayRepo {
    private connection
    private playRepo

    constructor(
        connectionInstance: DataSource
    ) {
        this.connection = connectionInstance
        this.playRepo = this.connection.getRepository(Play)
    }

    private playQuery() {
        return this.connection.createQueryBuilder(Play, 'p')
            .innerJoinAndSelect('p.playImages', 'pi')
            .innerJoinAndSelect('pi.image', 'i')
            .innerJoinAndSelect('p.sessions', 's')
            .distinct()
    }

    public async filterPlays(title: string) {
        return this.playQuery()
            .where('p.title LIKE :title', { title })
            .getMany()
    }

    public async getSingle(idPlay: number) {
        return this.playQuery()
            .where('p.id = :idPlay', { idPlay })
            .getOne()
    }

    public async getAll() {
        return this.playQuery().getMany()
    }

    public async createPlay(payload: PlayBaseInterface) {
        const newPlay = new Play()
        newPlay.title = payload.title
        newPlay.description = payload.description

        await this.playRepo.save(newPlay)
    }

    public async createPlays(payload: PlayBaseInterface[]) {
        let plays: Play[] = []
        for (const chunk of payload) {
            const newPlay = new Play()
            newPlay.title = chunk.title
            newPlay.description = chunk.description

            plays.push(newPlay)
        }
        await this.playRepo.save(plays)
    }

    public async deletePlay(idPlay: number) {
        const play = await this.playRepo.findOne({
            where: {
                id: idPlay
            }
        })

        if (!play) throw 'Спектакль не найден!'
        await this.playRepo.remove(play)
    }
}