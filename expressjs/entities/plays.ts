import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { PlayImage } from './plays_images'
import { Session } from './sessions'

@Entity({ name: 'plays' })
export class Play {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column()
    description!: string

    @Column({ type: 'text', nullable: true })
    crew!: string | null

    @OneToMany(() => Session, session => session.play)
    sessions!: Session[]

    @OneToMany(() => PlayImage, playImage => playImage.play)
    playImages!: PlayImage[] 
}