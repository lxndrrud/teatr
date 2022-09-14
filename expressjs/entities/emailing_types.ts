import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from'typeorm'
import { ReservationEmailing } from './reservations_emailings'
import { UserRestoration } from './users_restorations'


@Entity({ name: 'emailing_types' })
export class EmailingType {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column({ unsigned: true })
    interval!: number

    @Column()
    repeatable!: boolean

    @OneToMany(() => UserRestoration, (userRestor) => userRestor.emailingType)
    userRestorations!: UserRestoration[] 

    @OneToMany(() => ReservationEmailing, (reservEmail) => reservEmail.emailingType)
    reservationEmailings!: ReservationEmailing[] 
}