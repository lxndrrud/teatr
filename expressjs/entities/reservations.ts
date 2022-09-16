import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { ReservationEmailing } from './reservations_emailings'
import { ReservationSlot } from './reservations_slots'
import { Session } from './sessions'
import { User } from './users'


@Entity({ name: 'reservations' })
export class Reservation {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'is_paid' })
    isPaid!: boolean

    @Column({ name: 'is_confirmed' })
    isConfirmed!: boolean

    @Column({ name: 'confirmation_code' })
    confirmationCode!: string 

    @Column({ name: 'created_at' })
    createdAt!: string

    @Column({ name: 'id_user' })
    idUser!: number

    @Column({ name: 'id_session' })
    idSession!: number

    @ManyToOne(() => User, user => user.reservations) 
    @JoinColumn({ name: 'id_user' })
    user!: User

    @ManyToOne(() => Session, session => session.reservations)
    @JoinColumn({ name: 'id_session' })
    session!: Session

    @OneToMany(() => ReservationEmailing, reservEmail => reservEmail.reservation)
    reservationEmailings!: ReservationEmailing[]

    @OneToMany(() => ReservationSlot, reservationSlot => reservationSlot.reservation)
    reservationSlots!: ReservationSlot[] 
}