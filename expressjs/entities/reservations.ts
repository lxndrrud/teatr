import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { ReservationEmailing } from './reservations_emailings'
import { User } from './users'


@Entity({ name: 'reservations' })
export class Reservation {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'id_user' })
    idUser!: number

    @Column({ name: 'id_session' })
    idSession!: number

    @ManyToOne(() => User, user => user.reservations) 
    @JoinColumn({ name: 'id_user' })
    user!: User

    @OneToMany(() => ReservationEmailing, reservEmail => reservEmail.reservation)
    reservationEmailings!: ReservationEmailing[]
}