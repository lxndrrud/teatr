import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { Row } from './rows'

@Entity({ name: 'auditoriums' })
export class Auditorium {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @OneToMany(() => Row, row => row.auditorium)
    rows!: Row[]
}