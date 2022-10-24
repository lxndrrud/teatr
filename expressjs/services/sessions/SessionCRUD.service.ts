import { ISessionPreparator } from "../../infrastructure/SessionPreparator.infra"
import { ISlotPreparator } from "../../infrastructure/SlotPreparator.infra"
import { InnerError } from "../../interfaces/errors"
import { SessionBaseInterface, SessionFilterQueryInterface, SessionInterface } from "../../interfaces/sessions"
import { SlotIsReservedInterface} from "../../interfaces/slots"
import { ISessionRedisRepo } from "../../redisRepositories/Session.redis"
import { ISessionFilterRedisRepo } from "../../redisRepositories/SessionFilter.redis"
import { ISessionRepo } from "../../repositories/Session.repo"


export interface ISessionCRUDService {
    createSession(payload: SessionBaseInterface): Promise<void>

    updateSession(idSession: number, payload: SessionBaseInterface): Promise<void>

    deleteSession(idSession: number): Promise<void>

    getUnlockedSessions(): Promise<SessionInterface[]>

    getSingleUnlockedSession(idSession: number): Promise<SessionInterface>

    getSessionsByPlay(idPlay: number): Promise<SessionInterface[]>

    getSlots(idSession: number): Promise<{
        number: number;
        title: string;
        seats: SlotIsReservedInterface[];
    }[]>
}

export class SessionCRUDService implements ISessionCRUDService {
    protected sessionRepo
    protected sessionPreparator
    protected slotPreparator
    protected sessionRedisRepo
    protected sessionFilterRedisRepo

    constructor(
        sessionRepoInstance: ISessionRepo,
        sessionRedisRepoInstance: ISessionRedisRepo,
        sessionFilterRedisRepoInstance: ISessionFilterRedisRepo,
        sessionPreparatorInstance: ISessionPreparator,
        slotPreparatorInstance: ISlotPreparator,
    ) {
        this.sessionRepo = sessionRepoInstance
        this.sessionPreparator = sessionPreparatorInstance
        this.slotPreparator = slotPreparatorInstance
        this.sessionRedisRepo = sessionRedisRepoInstance
        this.sessionFilterRedisRepo= sessionFilterRedisRepoInstance
    }

    public async createSession(payload: SessionBaseInterface) {
        await this.sessionRepo.createSession(payload)
    }
    
    public async updateSession(idSession: number, payload: SessionBaseInterface) {
        await Promise.all([
            this.sessionRedisRepo.clearSession(idSession),
            this.sessionFilterRedisRepo.clearFilteredSessions(),
            this.sessionRepo.updateSession(idSession, payload)
        ])
    }

    public async deleteSession(idSession: number) {
        await Promise.all([
            this.sessionRedisRepo.clearSession(idSession),
            this.sessionFilterRedisRepo.clearFilteredSessions(),
            this.sessionRepo.deleteSession(idSession)
        ])
    }

    public async getUnlockedSessions() {
        const sessionCache = await this.sessionFilterRedisRepo
            .getFilteredSessions(<SessionFilterQueryInterface> {
                'auditorium_title': 'undefined',
                'play_title': 'undefined',
                'dateFrom': 'undefined',
                'dateTo': 'undefined'
            })
        if (sessionCache) return sessionCache
        const sessions = await this.sessionRepo.getUnlockedSessions()
        return sessions.map(session => this.sessionPreparator.prepareSession(session))
    }

    public async getSingleUnlockedSession(idSession: number) {
        const session = await this.sessionRepo.getUnlockedSession(idSession)
        if (!session) throw new InnerError("Сеанс не найден.", 404)
        return this.sessionPreparator.prepareSession(session)
    }

    public async getSessionsByPlay(idPlay: number) {
        const sessions = await this.sessionRepo.getUnlockedSessionsByPlay(idPlay)
        return sessions.map(session => this.sessionPreparator.prepareSession(session)) 
    }

    public async getSlots(idSession: number) {
        const session = await this.sessionRepo.getUnlockedSession(idSession)
        if (!session) throw new InnerError('Сеанс не найден.', 404)

        const [rows, slots, reservedSlots] = await Promise.all([
            this.sessionRepo.getRowsByPricePolicy(session.idPricePolicy),
            this.sessionRepo.getSlotsByPricePolicy(session.idPricePolicy),
            this.sessionRepo.getReservedSlots(session.id, session.idPricePolicy)
        ])
        return this.slotPreparator.prepareSlotsForSession(rows, slots, reservedSlots)
    }
}