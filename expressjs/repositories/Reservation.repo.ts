import { Brackets, DataSource, RemoveOptions } from "typeorm"; 
import { Reservation } from "../entities/reservations";
import { ReservationFilterQueryInterface } from "../interfaces/reservations";
import { TimestampHelper } from "../utils/timestamp";


export interface IReservationRepo {
    getReservations(): Promise<Reservation[]>
    getReservations(): Promise<Reservation[]>
    getReservationsForUser(idUser: number): Promise<Reservation[]>
    getReservation(idReservation: number): Promise<Reservation | null>
    paymentForReservation(idReservation: number): Promise<void>
    confirmReservation(idReservation: number): Promise<void>
    deleteReservation(idReservation: number): Promise<void>
    getFilteredReservations(userQuery: ReservationFilterQueryInterface, idUser?: number | undefined): Promise<Reservation[]>
} 

export class ReservationRepo implements IReservationRepo {
    private connection
    private reservationRepo
    private timestampHelper

    constructor(
        connectionInstance: DataSource,
        timestampHelperInstance: TimestampHelper
    ) {
        this.connection = connectionInstance
        this.reservationRepo = this.connection.getRepository(Reservation)
        this.timestampHelper = timestampHelperInstance
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

    public async getFilteredReservations(userQuery: ReservationFilterQueryInterface, idUser?: number) {
        const reservations = await this.reservationQuery()
            .andWhere( new Brackets(builder => {
                if (userQuery.date !== undefined && userQuery.date !== 'undefined') {
                    builder.andWhere(new Brackets(innerBuilder => {
                        innerBuilder
                            .andWhere(`s.timestamp >= :dateFrom`, {dateFrom: `${userQuery.date}T00:00:00` })
                        innerBuilder
                            .andWhere(`s.timestamp < :dateTo`, { dateTo: this.timestampHelper.getNextDayOfTimestamp(userQuery.date)})
                    }))
                }
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
        const reservation = await this.reservationRepo.findOneOrFail({
            where: {
                id: idReservation
            }
        })

        reservation.isConfirmed = true
        reservation.isPaid = true

        await this.reservationRepo.save(reservation)
    }

    public async confirmReservation(idReservation: number) {
        const reservation = await this.reservationRepo.findOneOrFail({
            where: {
                id: idReservation
            }
        })

        reservation.isConfirmed = true

        await this.reservationRepo.save(reservation)
    }

    public async deleteReservation(idReservation: number) {
        const reservation = await this.reservationRepo.findOneOrFail({
            where: {
                id: idReservation
            },
            relations: {
                reservationEmailings: true,
                reservationSlots: true
            }
        })

        await this.reservationRepo.remove(reservation)
    }
}