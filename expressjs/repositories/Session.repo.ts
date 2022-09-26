import { Brackets, DataSource } from "typeorm"
import { Auditorium } from "../entities/auditoriums"
import { Play } from "../entities/plays"
import { Row } from "../entities/rows"
import { Session } from "../entities/sessions"
import { Slot } from "../entities/slots"
import { InnerError } from "../interfaces/errors"
import { SessionBaseInterface, SessionFilterQueryInterface } from "../interfaces/sessions"

export interface ISessionRepo {
    getSession(idSession: number): Promise<Session | null>
    getUnlockedSessions(): Promise<Session[]>
    getUnlockedSession(idSession: number): Promise<Session | null>
    getUnlockedSessionsByPlay(idPlay: number): Promise<Session[]>

    getSessionFilterPlays(): Promise<Play[]>
    getSessionFilterAuditoriums(): Promise<Auditorium[]>
    getFilteredSessions(userQueryPayload: SessionFilterQueryInterface): Promise<Session[]>

    getSlotsByPricePolicy(idPricePolicy: number): Promise<Slot[]>
    getRowsByPricePolicy(idPricePolicy: number): Promise<Row[]>
    getReservedSlots(idSession: number, idPricePolicy: number): Promise<Slot[]>

    createSession(payload: SessionBaseInterface): Promise<void>
    createSessions(payload: SessionBaseInterface[]): Promise<void>
    updateSession(idSession: number, payload: SessionBaseInterface): Promise<void>
    deleteSession(idSession: number): Promise<void>

    // Крон
    lockSessions(lockTimestamp: string): Promise<number[]>
}


export class SessionRepo implements ISessionRepo {
    private connection
    private sessionRepo

    constructor(
        connectionInstance: DataSource
    ) {
        this.connection = connectionInstance
        this.sessionRepo = this.connection.getRepository(Session)
    }

    private sessionQuery() {
        return this.connection.createQueryBuilder(Session, 's')
            .innerJoinAndSelect('s.play', 'p')
            .innerJoinAndSelect('s.pricePolicy', 'pp')
            .innerJoinAndSelect('pp.slots', 'slot')
            .innerJoinAndSelect('slot.seat', 'seat')
            .innerJoinAndSelect('seat.row', 'row')
            .innerJoinAndSelect('row.auditorium', 'a')
            .innerJoinAndSelect('p.playImages', 'pi')
            .innerJoinAndSelect('pi.image', 'i')
            .orderBy('s.timestamp', 'ASC')
    }

    private unlockedSessionsQuery() {
        return this.sessionQuery()
            .where('s.isLocked = :isLocked', { isLocked: false })
            .andWhere('pi.isPoster = :isPoster', { isPoster: true })
            .distinct()
    }

    public async getAll() {
        return this.sessionQuery().getMany()
    }

    public async getSession(idSession: number) {
        return this.sessionQuery()
            .where('s.id = :idSession', { idSession })
            .getOne()
    }

    public async getUnlockedSessions() {
        return this.unlockedSessionsQuery()
            .getMany()
    }

    public async getUnlockedSession(idSession: number) {
        return this.unlockedSessionsQuery()
            .andWhere('s.id = :idSession', { idSession })
            .getOne()
    }

    public async getUnlockedSessionsByPlay(idPlay: number) {
        return this.unlockedSessionsQuery()
            .andWhere('p.id = :idPlay', { idPlay })
            .getMany()
    }

    public async createSession(payload: SessionBaseInterface) {
        const newSession = new Session()
        newSession.idPlay = payload.id_play
        newSession.idPricePolicy = payload.id_price_policy
        newSession.isLocked = payload.is_locked
        newSession.maxSlots = payload.max_slots
        newSession.timestamp = payload.timestamp

        await this.sessionRepo.save(newSession)
    }

    public async createSessions(payload: SessionBaseInterface[]) {
        for (const session of payload) {
            await this.createSession(session)
        }
    }

    public async updateSession(idSession: number, payload: SessionBaseInterface) {
        const session = await this.getSession(idSession)
        if (!session) throw new InnerError('Сеанс не найден', 404)

        session.idPlay = payload.id_play
        session.idPricePolicy = payload.id_price_policy
        session.isLocked = payload.is_locked
        session.maxSlots = payload.max_slots
        session.timestamp = payload.timestamp

        await this.sessionRepo.save(session)
    }

    public async deleteSession(idSession: number) {
        const session = await this.getSession(idSession)
        if (!session) throw new InnerError('Сеанс не найден.', 404)

        await this.sessionRepo.remove(session)
    }

    public async getSessionFilterPlays() {
        return this.connection.createQueryBuilder(Play, 'p')
            .select(['p.title'])
            .innerJoin('p.sessions', 's')
            .where('s.isLocked = :isLocked', { isLocked: false })
            .distinct()
            .getMany()
    }

    public async getSessionFilterAuditoriums() {
        return this.connection.createQueryBuilder(Auditorium, 'a')
            .select(['a.title'])
            .innerJoin('a.rows', 'row')
            .innerJoin('row.seats', 'seat')
            .innerJoin('seat.slots', 'slot')
            .innerJoin('slot.pricePolicy', 'pp')
            .innerJoin('pp.sessions', 'session')
            .where('session.isLocked = :isLocked', { isLocked: false })
            .distinct()
            .getMany()
    }

    public async getFilteredSessions(userQueryPayload: SessionFilterQueryInterface) {
        return this.unlockedSessionsQuery()
            .andWhere(new Brackets(innerBuilder => {
                // Фильтр с даты
                if (userQueryPayload.dateFrom  && userQueryPayload.dateFrom !== 'undefined') 
                    innerBuilder.andWhere('s.timestamp >= :dateFrom', { dateFrom: userQueryPayload.dateFrom + "T00:00:00" })
                // Фильтр по дату
                if (userQueryPayload.dateTo  && userQueryPayload.dateTo !== 'undefined') 
                    innerBuilder.andWhere('s.timestamp <= :dateTo', { dateTo: userQueryPayload.dateTo + "T00:00:00" })
                // Фильтр по названию зала
                if (userQueryPayload.auditorium_title && userQueryPayload.auditorium_title !== 'undefined')
                    innerBuilder.andWhere('a.title = :auditoriumTitle', { auditoriumTitle: userQueryPayload.auditorium_title })
                // Фильтр по названию спектакля
                if (userQueryPayload.play_title && userQueryPayload.play_title !== 'undefined')
                    innerBuilder.andWhere('p.title = :playTitle', { playTitle: userQueryPayload.play_title })
            }))
            .getMany()
    }

    public async getSlotsByPricePolicy(idPricePolicy: number) {
        return this.connection.createQueryBuilder(Slot, 'slot')
            .innerJoinAndSelect('slot.seat', 'seat')
            .innerJoinAndSelect('seat.row', 'row')
            .innerJoinAndSelect('row.auditorium', 'a')
            .where('slot.idPricePolicy = :idPricePolicy', { idPricePolicy })
            .getMany()
    }

    public async getReservedSlots(idSession: number, idPricePolicy: number) {
        return this.connection.createQueryBuilder(Slot, 'slot')
            .innerJoinAndSelect('slot.seat', 'seat')
            .innerJoinAndSelect('seat.row', 'row')
            .innerJoinAndSelect('row.auditorium', 'a')
            .innerJoinAndSelect('slot.reservationSlots', 'rs')
            .innerJoinAndSelect('rs.reservation', 'r')
            .where('slot.idPricePolicy = :idPricePolicy', { idPricePolicy })
            .andWhere('r.idSession = :idSession', { idSession })
            .getMany()
    }

    public async getRowsByPricePolicy(idPricePolicy: number) {
        return this.connection.createQueryBuilder(Row, 'row')
            .innerJoinAndSelect('row.seats', 'seat')
            .innerJoinAndSelect('seat.slots', 'slot')
            .where('slot.idPricePolicy = :idPricePolicy', { idPricePolicy })
            .distinct()
            .getMany()
    }

    /**
     * Закрыть незакрытые сеансы, до которых осталось менее lockTimestamp
     * Предполагается использование только в кроне
     */
    public async lockSessions(lockTimestamp: string) {
        const sessions = await this.connection.createQueryBuilder(Session, 's')
            .where('s.isLocked = :isLocked', { isLocked: false })
            .andWhere('s.timestamp <= :lockTimestamp', { lockTimestamp })
            .getMany()
        const idsArr = sessions.map(session => session.id)

        if (sessions.length > 0) {
            await this.connection.transaction(async trx => {
                sessions.forEach(session => { session.isLocked = true })
                await trx.save(sessions)
            }) 
        }
        return idsArr
    }
}
