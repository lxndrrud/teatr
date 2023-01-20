import { createStubInstance, SinonStubbedInstance, restore } from 'sinon'
import { Play } from '../../entities/plays'
import { IPlayPreparator, PlayPreparator } from '../../infrastructure/PlayPreparator.infra'
import { IPlayRedisRepo, PlayRedisRepo } from '../../redisRepositories/Play.redis'
import { IPlayRepo, PlayRepo } from '../../repositories/Play.repo'
import { FileStreamHelper, IFileStreamHelper } from '../../utils/fileStreams'
import { PlayService } from './PlayService'

describe("PlayService tests", () => {
    afterEach(() => {
        restore()
    })
    describe("Get all unlocked plays", () => {
        
        it("Get plays from Database, Cache IS empty", async () => {
            const playRepo: SinonStubbedInstance<PlayRepo> = createStubInstance(PlayRepo);
            playRepo.getAll.resolves([ new Play() ])
            const playRedisRepo: SinonStubbedInstance<PlayRedisRepo> = createStubInstance(PlayRedisRepo);
            playRedisRepo.getUnlockedPlays.resolves(null)
            const fileStreamHelper: SinonStubbedInstance<FileStreamHelper> = createStubInstance(FileStreamHelper);
            const playPreparator: SinonStubbedInstance<PlayPreparator> = createStubInstance(PlayPreparator);
            playPreparator.preparePlayWithPoster.returns({
                title: "Test title",
                description: ["Test description"],
                crew: ["Test crew"],
                poster_filepath: "Test filepath",
            })

            const playService = new PlayService(
                playRepo as IPlayRepo,
                playRedisRepo as IPlayRedisRepo,
                fileStreamHelper as IFileStreamHelper,
                playPreparator as IPlayPreparator
            )

            const result = await playService.getAll()

            expect(playRedisRepo.getUnlockedPlays.callCount).toEqual(1)
            expect(playRepo.getAll.callCount).toEqual(1)
            expect(playPreparator.preparePlayWithPoster.callCount).toEqual(1)
            expect(playRedisRepo.setUnlockedPlays.callCount).toEqual(1)
            expect(result).toEqual([
                {
                    title: "Test title",
                    description: ["Test description"],
                    crew: ["Test crew"],
                    poster_filepath: "Test filepath",
                }
            ])
        })

        it("Get plays from Cache, Cache IS NOT empty", async () => {
            const playRepo: SinonStubbedInstance<PlayRepo> = createStubInstance(PlayRepo);
            playRepo.getAll.resolves([ new Play() ])
            const playRedisRepo: SinonStubbedInstance<PlayRedisRepo> = createStubInstance(PlayRedisRepo);
            playRedisRepo.getUnlockedPlays.resolves([
                {
                    title: "Test title",
                    description: ["Test description"],
                    crew: ["Test crew"],
                    poster_filepath: "Test filepath",
                }
            ])
            const fileStreamHelper: SinonStubbedInstance<FileStreamHelper> = createStubInstance(FileStreamHelper);
            const playPreparator: SinonStubbedInstance<PlayPreparator> = createStubInstance(PlayPreparator);

            const playService = new PlayService(
                playRepo as IPlayRepo,
                playRedisRepo as IPlayRedisRepo,
                fileStreamHelper as IFileStreamHelper,
                playPreparator as IPlayPreparator
            )

            const result = await playService.getAll()

            expect(playRedisRepo.getUnlockedPlays.callCount).toEqual(1)
            expect(playRepo.getAll.callCount).toEqual(0)
            expect(playPreparator.preparePlayWithPoster.callCount).toEqual(0)
            expect(playRedisRepo.setUnlockedPlays.callCount).toEqual(0)
            expect(result).toEqual([
                {
                    title: "Test title",
                    description: ["Test description"],
                    crew: ["Test crew"],
                    poster_filepath: "Test filepath",
                }
            ])
        })
    })
    describe("Get single unlocked play", () => {

        it("Get play from Database, Cache IS empty", async () => {
            const playRepo: SinonStubbedInstance<PlayRepo> = createStubInstance(PlayRepo);
            playRepo.getSingle.resolves(new Play())
            const playRedisRepo: SinonStubbedInstance<PlayRedisRepo> = createStubInstance(PlayRedisRepo);
            playRedisRepo.getUnlockedPlay.resolves(null)
            const fileStreamHelper: SinonStubbedInstance<FileStreamHelper> = createStubInstance(FileStreamHelper);
            const playPreparator: SinonStubbedInstance<PlayPreparator> = createStubInstance(PlayPreparator);
            playPreparator.preparePlayWithPoster.returns({
                title: "Test title",
                description: ["Test description"],
                crew: ["Test crew"],
                poster_filepath: "Test filepath",
            })

            const playService = new PlayService(
                playRepo as IPlayRepo,
                playRedisRepo as IPlayRedisRepo,
                fileStreamHelper as IFileStreamHelper,
                playPreparator as IPlayPreparator
            )

            const result = await playService.getSinglePlay(1)

            expect(playRedisRepo.getUnlockedPlay.callCount).toEqual(1)
            expect(playRepo.getSingle.callCount).toEqual(1)
            expect(playRepo.getSingle.calledWith(1)).toBeTruthy()
            expect(playPreparator.preparePlayWithPoster.callCount).toEqual(1)
            expect(playRedisRepo.setUnlockedPlay.callCount).toEqual(1)
            expect(playRedisRepo.setUnlockedPlay.calledWith(1, {
                title: "Test title",
                description: ["Test description"],
                crew: ["Test crew"],
                poster_filepath: "Test filepath",
            })).toBeTruthy()
            expect(result).toEqual({
                title: "Test title",
                description: ["Test description"],
                crew: ["Test crew"],
                poster_filepath: "Test filepath",
            })
        })

        it("Get play from Cache, Cache IS NOT empty", async () => {
            const playRepo: SinonStubbedInstance<PlayRepo> = createStubInstance(PlayRepo);
            const playRedisRepo: SinonStubbedInstance<PlayRedisRepo> = createStubInstance(PlayRedisRepo);
            playRedisRepo.getUnlockedPlay.resolves({
                title: "Test title",
                description: ["Test description"],
                crew: ["Test crew"],
                poster_filepath: "Test filepath",
            })
            const fileStreamHelper: SinonStubbedInstance<FileStreamHelper> = createStubInstance(FileStreamHelper);
            const playPreparator: SinonStubbedInstance<PlayPreparator> = createStubInstance(PlayPreparator);

            const playService = new PlayService(
                playRepo as IPlayRepo,
                playRedisRepo as IPlayRedisRepo,
                fileStreamHelper as IFileStreamHelper,
                playPreparator as IPlayPreparator
            )

            const result = await playService.getSinglePlay(1)

            expect(playRedisRepo.getUnlockedPlay.callCount).toEqual(1)
            expect(playRepo.getSingle.callCount).toEqual(0)
            expect(playPreparator.preparePlayWithPoster.callCount).toEqual(0)
            expect(playRedisRepo.setUnlockedPlay.callCount).toEqual(0)
            expect(result).toEqual({
                title: "Test title",
                description: ["Test description"],
                crew: ["Test crew"],
                poster_filepath: "Test filepath",
            })
        })
    })
})