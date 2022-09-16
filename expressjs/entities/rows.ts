import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { Auditorium } from './auditoriums'
import { Seat } from './seats'

@Entity({ name: 'rows' })
export class Row {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column()
    number!: number

    @Column({ name: 'id_auditorium' })
    idAuditorium!: number

    @OneToMany(() => Seat, seat => seat.row)
    seats!: Seat[]

    @ManyToOne(() => Auditorium, auditorium => auditorium.rows)
    @JoinColumn({ name: 'id_auditorium' })
    auditorium!: Auditorium 
}