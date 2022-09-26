import { PlayBaseInterface, PlayWithPosterInterface } from "../../interfaces/plays";
import { InnerError } from "../../interfaces/errors";
import { UploadedFile } from "express-fileupload";
import fs from "fs"
import csvParser from "csv-parser";
import { IFileStreamHelper } from "../../utils/fileStreams";
import { IPlayRepo} from '../../repositories/Play.repo'
import { IPlayPreparator } from "../../infrastructure/PlayPreparator.infra";
import { IPlayRedisRepo } from '../../redisRepositories/Play.redis'

export interface IPlayService {
    getAll(): Promise<PlayWithPosterInterface[]>
    getSinglePlay(idPlay: number): Promise< PlayWithPosterInterface>
    createPlay(payload: PlayBaseInterface): Promise<void>
    updatePlay(idPlay: number, payload: PlayBaseInterface): Promise<void>
    deletePlay(idPlay: number): Promise<void>
    createPlaysCSV(file: UploadedFile): Promise<void>
}

export class PlayService implements IPlayService {
    private playRepo 
    private playRedisRepo
    private fileStreamHelper
    private playPreparator

    constructor(
        playRepoInstance: IPlayRepo,
        playRedisRepoInstance: IPlayRedisRepo,
        fileStreamHelperInstance: IFileStreamHelper,
        playPreparatorInstance: IPlayPreparator
    ) {
        this.playRepo = playRepoInstance
        this.fileStreamHelper = fileStreamHelperInstance
        this.playPreparator = playPreparatorInstance
        this.playRedisRepo = playRedisRepoInstance
    }

    public async getAll() {
        const plays = await this.playRepo.getAll()
        return plays.map(play => this.playPreparator.preparePlayWithPoster(play))
    }

    public async getSinglePlay(idPlay: number) {
        const playCache = await this.playRedisRepo.getPlay(idPlay)
        if (playCache) {
            return playCache
        }
        const play = await this.playRepo.getSingle(idPlay)
        if (!play) throw new InnerError('Спектакль не найден.', 404)
        const preparedPlay = this.playPreparator.preparePlayWithPoster(play)
        await this.playRedisRepo.setPlay(idPlay, preparedPlay)
        return preparedPlay
    }

    public async createPlay(payload: PlayBaseInterface) {
        await this.playRepo.createPlay(payload)
    }

    public async updatePlay(idPlay: number, payload: PlayBaseInterface) {
        await this.playRepo.updatePlay(idPlay, payload)
    }

    public async deletePlay(idPlay: number) {
        await this.playRepo.deletePlay(idPlay)
    }

    public async createPlaysCSV(file: UploadedFile) {
        const dataArray: PlayBaseInterface[] = []
        const data = await this.fileStreamHelper
            .readData(fs.createReadStream(file.tempFilePath).pipe(csvParser()))
        for (const chunk of data) {
            if (!chunk["Номер строки"]) 
                throw new InnerError(`Не указан номер строки в файле!`, 400) 
            else if (!chunk["Название"]) 
                throw new InnerError(`В строке ${chunk["Номер строки"]} не указано название спектакля!`, 400)
            dataArray.push({ 
                title: chunk["Название"], 
                description: chunk["Описание"]
            })
        }
        fs.rmSync(file.tempFilePath)
        //fs.unlinkSync(file.tempFilePath)
        await this.playRepo.createPlays(dataArray)
    }
}
