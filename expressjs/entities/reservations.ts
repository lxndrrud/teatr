import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from'typeorm'


@Entity({ name: 'reservations' })
export class Reservation {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'id_user' })
    idUser!: number

    @Column({ name: 'id_session' })
    idSession!: number
}