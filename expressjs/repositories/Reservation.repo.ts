import { Brackets, DataSource, RemoveOptions } from "typeorm"; 
import { Auditorium } from "../entities/auditoriums";
import { Play } from "../entities/plays";
import { Reservation } from "../entities/reservations";
import { ReservationSlot } from "../entities/reservations_slots";
import { Slot } from "../entities/slots";
import { InnerError } from "../interfaces/errors";
import { ReservationBaseInterface, ReservationFilterQueryInterface } from "../interfaces/reservations";
import { ReservationSlotDependency } from "../interfaces/slots";


export interface IReservationRepo {
    // Reservations
    getReservations(): Promise<Reservation[]>
    getReservations(): Promise<Reservation[]>
    getReservationsForUser(idUser: number): Promise<Reservation[]>
    getReservation(idReservation: number): Promise<Reservation | null>
    getReservedSlots(idReservation: number): Promise<Slot[]>

    // Filter
    getFilteredReservations(userQuery: ReservationFilterQueryInterface, idUser?: number | undefined): Promise<Reservation[]>
    getPlaysOptionsForReservationFilter(idUser?: number | undefined): Promise<Play[]>
    getAuditoriumsOptionsForReservationFilter(idUser?: number | undefined): Promise<Auditorium[]>

    // CUD operations
    paymentForReservation(idReservation: number): Promise<void>
    confirmReservation(idReservation: number): Promise<void>
    createReservation(reservationPayload: ReservationBaseInterface, isReservationConfirmed: boolean, 
        slotsPayload: ReservationSlotDependency[]): Promise<Reservation>
    deleteReservation(idReservation: number): Promise<void>
    
    // logic checks
    checkHasUserReservedSession(idUser: number, idSession: number): Promise<boolean>

    // cron 
    deleteReservationsCron(reservationDeleteTimestamp: string): Promise<void>
} 

export class ReservationRepo implements IReservationRepo {
    private connection
    private reservationRepo

    constructor(
        connectionInstance: DataSource,
    ) {
        this.connection = connectionInstance
        this.reservationRepo = this.connection.getRepository(Reservation)
    }

    private reservationQuery() {
        return this.connection.createQueryBuilder(Reservation, 'r')
            .innerJoinAndSelect('r.session', 's')
            .innerJoinAndSelect('s.play', 'p')
            .innerJoinAndSelect('r.user', 'u')
            .innerJoinAndSelect('r.reservationSlots', 'rs')
            .innerJoinAndSelect('rs.slot', 'slot')
            .innerJoinAndSelect('slot.seat', 'seat')
            .innerJoinAndSelect('seat.row', 'row')
            .innerJoinAndSelect('row.auditorium', 'a')
            .innerJoinAndSelect('slot.pricePolicy', 'pp')
            .leftJoinAndSelect('r.reservationEmailings', 're')
            .leftJoinAndSelect('re.emailingType', 'et')
            .distinct()
            .orderBy("r.createdAt", "ASC")
    } 
    
    public async getReservations() {
        const reservations = await this.reservationQuery().getMany()
        return reservations
    }

    public async getReservationsForUser(idUser: number) {
        const reservations = await this.reservationQuery()
            .andWhere('u.id = :idUser', { idUser })
            .getMany()
        return reservations
    }

    public async getReservation(idReservation: number) {
        const reservation = await this.reservationQuery()
            .where('r.id = :idReservation', { idReservation })
            .getOne()

        return reservation
    }

    public async getReservedSlots(idReservation: number) {
        return this.connection.createQueryBuilder(Slot, 'slot')
            .innerJoinAndSelect('slot.seat', 'seat')
            .innerJoinAndSelect('seat.row', 'row')
            .innerJoinAndSelect('row.auditorium', 'a')
            .innerJoinAndSelect('slot.reservationSlots', 'rs')
            .where('rs.idReservation = :idReservation', { idReservation })
            .distinct()
            .getMany()
    }

    public async getFilteredReservations(userQuery: ReservationFilterQueryInterface, idUser?: number) {
        const reservations = await this.reservationQuery()
            .andWhere( new Brackets(builder => {
                if (userQuery.dateFrom !== undefined && userQuery.dateFrom !== 'undefined') 
                    builder.andWhere(`s.timestamp >= :dateFrom`, { dateFrom: `${userQuery.dateFrom}T00:00:00` })
                if (userQuery.dateTo !== undefined && userQuery.dateTo !== 'undefined') 
                    builder.andWhere(`s.timestamp <= :dateTo`, { dateTo: `${userQuery.dateTo}T23:59:00` })
                if (userQuery.auditorium_title !== undefined && userQuery.auditorium_title !== 'undefined') 
                    builder.andWhere(`a.title = :auditoriumTitle `, { auditoriumTitle: userQuery.auditorium_title})
                if (userQuery.play_title !== undefined && userQuery.play_title !== 'undefined') 
                    builder.andWhere('p.title = :playTitle', { playTitle: userQuery.play_title })
                if (userQuery.is_locked !== undefined && userQuery.is_locked !== 'undefined') {
                    if (userQuery.is_locked === 'true') {
                        builder.andWhere('s.is_locked = :isLocked ', { isLocked: true })
                    }
                    else if (userQuery.is_locked === 'false') {
                        builder.andWhere('s.is_locked = :isLocked',  { isLocked: false })
                    }
                }
                if (userQuery.id_reservation !== undefined && userQuery.id_reservation !== 'undefined') 
                    builder.andWhere('r.id = :idReservation', { idReservation: parseInt(userQuery.id_reservation) })
                if (idUser)  {
                    builder.andWhere('u.id = :idUser', { idUser })
                }
            }))
            .getMany()
        return reservations
    }

    public async paymentForReservation(idReservation: number) {
        const reservation = await this.reservationRepo.findOne({
            where: {
                id: idReservation
            }
        })
        if (!reservation) throw new InnerError('Бронь не найдена!', 404)

        reservation.isConfirmed = true
        reservation.isPaid = true

        await this.reservationRepo.save(reservation)
    }

    public async confirmReservation(idReservation: number) {
        const reservation = await this.reservationRepo.findOne({
            where: {
                id: idReservation
            }
        })
        if (!reservation) throw new InnerError('Бронь не найдена!', 404)

        reservation.isConfirmed = true

        await this.reservationRepo.save(reservation)
    }

    public async createReservation(reservationPayload: ReservationBaseInterface, isReservationConfirmed: boolean, 
        slotsPayload: ReservationSlotDependency[]) {
        const newReservation = new Reservation()
        newReservation.idUser = reservationPayload.id_user
        newReservation.idSession = reservationPayload.id_session
        newReservation.confirmationCode = reservationPayload.confirmation_code
        newReservation.isConfirmed = isReservationConfirmed

        return await this.connection.transaction(async trx => {
            const reservationInserted = await trx.save(newReservation)
            const slotsList = slotsPayload.map(slotPayload => {
                const newReservationSlot = new ReservationSlot()
                newReservationSlot.idReservation = reservationInserted.id
                newReservationSlot.idSlot = slotPayload.id
                return newReservationSlot
            })
            await trx.save(slotsList)
            return reservationInserted
        })
    }

    public async deleteReservation(idReservation: number) {
        const reservation = await this.reservationRepo.findOne({
            where: {
                id: idReservation
            },
            relations: {
                reservationEmailings: true,
                reservationSlots: true
            }
        })
        if (!reservation) throw new InnerError('Бронь не найдена', 404)

        await this.connection.transaction(async trx => {
            await trx.remove(reservation.reservationEmailings)
            await trx.remove(reservation.reservationSlots)
            await trx.remove(reservation)
        })
    }

    public async getPlaysOptionsForReservationFilter(idUser?: number) {
        return this.connection.createQueryBuilder(Play, 'p')
            .select([ 'p.title' ])
            .innerJoin('p.sessions', 's')
            .innerJoin('s.reservations', 'r')
            .where(new Brackets(builder => {
                if (idUser) builder.where('r.idUser = :idUser', { idUser })
            }))
            .distinct()
            .getMany()
    }

    public async getAuditoriumsOptionsForReservationFilter(idUser?: number) {
        return this.connection.createQueryBuilder(Auditorium, 'a')
            .select([ 'a.title' ])
            .innerJoin('a.rows', 'row')
            .innerJoin('row.seats', 'seat')
            .innerJoin('seat.slots', 'slot')
            .innerJoin('slot.pricePolicy', 'pp')
            .innerJoin('pp.sessions', 's')
            .innerJoin('s.reservations', 'r')
            .where(new Brackets(builder => {
                if (idUser) builder.where('r.idUser = :idUser', { idUser })
            }))
            .distinct()
            .getMany()
    }

    public async checkHasUserReservedSession(idUser: number, idSession: number) {
        const check = await this.reservationRepo.count({
            where: {
                idSession, idUser
            }
        })
        return check > 0 ? true : false 
    }

    public async deleteReservationsCron(reservationDeleteTimestamp: string) {
        const reservations = await this.connection.createQueryBuilder(Reservation, 'r')
            .innerJoinAndSelect('r.session', 's')
            .where(new Brackets(builder => {
                builder.where('r.createdAt <= :resDelTimestamp', { resDelTimestamp: reservationDeleteTimestamp })
                builder.andWhere('r.isConfirmed = :isConfirmedFalse', { isConfirmedFalse: false })
            }))
            .orWhere(new Brackets(builder => {
                builder.where('s.isLocked = :isLockedTrue', { isLockedTrue: true })
                builder.andWhere('r.isPaid = :isPaidFalse', { isPaidFalse: false })
            }))
            .getMany()

        for (const reservation of reservations) {
            await this.deleteReservation(reservation.id)
        }
    }
}