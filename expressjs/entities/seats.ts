import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { Row } from './rows'
import { Slot } from './slots'

@Entity({ name: 'seats' })
export class Seat {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    number!: number

    @Column({ name: 'id_row' })
    idRow!: number

    @OneToMany(() => Slot, slot => slot.seat)
    slots!: Slot[]

    @ManyToOne(() => Row, row => row.seats)
    @JoinColumn({ name: 'id_row' })
    row!: Row 
}