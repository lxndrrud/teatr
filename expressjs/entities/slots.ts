import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { PricePolicy } from './price_policies'
import { ReservationSlot } from './reservations_slots'
import { Seat } from './seats'

@Entity({ name: 'slots' })
export class Slot { 
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    price!: number

    @Column({ name: 'id_price_policy' })
    idPricePolicy!: number

    @Column({ name: 'id_seat' })
    idSeat!: number

    @ManyToOne(() => Seat, seat => seat.slots)
    @JoinColumn({ name: 'id_seat' })
    seat!: Seat

    @ManyToOne(() => PricePolicy, pricePolicy => pricePolicy.slots)
    @JoinColumn({ name: 'id_price_policy' })
    pricePolicy!: PricePolicy 

    @OneToMany(() => ReservationSlot, reservationSlot => reservationSlot.slot)
    reservationSlots!:  ReservationSlot[]
}