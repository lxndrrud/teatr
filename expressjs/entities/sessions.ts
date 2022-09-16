import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { Play } from './plays'
import { PricePolicy } from './price_policies'
import { Reservation } from './reservations'


@Entity({ name: 'sessions' })
export class Session {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'is_locked' })
    isLocked!: boolean

    @Column()
    timestamp!: string 

    @Column({ name: 'max_slots' })
    maxSlots!: number 

    @Column({ name: 'id_play' })
    idPlay!: number

    @Column({ name: 'id_price_policy' })
    idPricePolicy!: number

    @ManyToOne(() => Play, play => play.sessions)
    @JoinColumn({ name: 'id_play' })
    play!: Play

    @ManyToOne(() => PricePolicy, pricePolicy => pricePolicy.sessions)
    @JoinColumn({ name: 'id_price_policy' })
    pricePolicy!: PricePolicy

    @OneToMany(() => Reservation, reservation => reservation.session)
    reservations!: Reservation[]
}
