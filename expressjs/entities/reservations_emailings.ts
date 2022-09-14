import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from'typeorm'
import { EmailingType } from './emailing_types'
import { Reservation } from './reservations'


@Entity({ name: 'reservations_emailings', orderBy: { timeCreated: "DESC" } })
export class ReservationEmailing {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'id_reservation' })
    idReservation!: number

    @Column({ name: 'id_emailing_type' })
    idEmailingType!: number

    @Column({ name: 'time_created' })
    timeCreated!: string

    @ManyToOne(() => Reservation, (reservation) => reservation.reservationEmailings)
    @JoinColumn({ name: 'id_reservation' })
    reservation!: Reservation

    @ManyToOne(() => EmailingType, (emailType) => emailType.reservationEmailings)
    @JoinColumn({ name: 'id_emailing_type' })
    emailingType!: EmailingType
}