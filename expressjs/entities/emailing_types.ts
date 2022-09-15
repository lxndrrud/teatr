import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from'typeorm'
import { ReservationEmailing } from './reservations_emailings'
import { UserRestoration } from './users_restorations'


@Entity({ name: 'emailing_types' })
export class EmailingType {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column({ name: 'repeat_interval', unsigned: true })
    repeatInterval!: number
    
    @Column({ name: 'resend_interval', unsigned: true })
    resendInterval!: number

    @Column()
    repeatable!: boolean

    @OneToMany(() => UserRestoration, (userRestor) => userRestor.emailingType)
    userRestorations!: UserRestoration[] 

    @OneToMany(() => ReservationEmailing, (reservEmail) => reservEmail.emailingType)
    reservationEmailings!: ReservationEmailing[] 
}