import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { Session } from './sessions'

@Entity({ name: 'plays' })
export class Play {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column()
    description!: string

    @OneToMany(() => Session, session => session.play)
    sessions!: Session[]
}