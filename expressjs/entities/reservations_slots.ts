import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { Reservation } from './reservations'
import { Slot } from './slots'

@Entity({ name: 'reservations_slots' })
export class ReservationSlot {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'id_reservation' })
    idReservation!: number 

    @Column({ name: 'id_slot' })
    idSlot!: number 

    @ManyToOne(() => Reservation, reservation => reservation.reservationSlots)
    @JoinColumn({ name: 'id_reservation' })
    reservation!: Reservation

    @ManyToOne(() => Slot)
    @JoinColumn({ name: 'id_slot' })
    slot!: Slot
}