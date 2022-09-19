import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { Image } from './images'
import { Play } from './plays'

@Entity({ name: 'plays_images' })
export class PlayImage {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'id_play' })
    idPlay!: number

    @Column({ name: 'id_image' })
    idImage!: number

    @Column({ name: 'is_poster' })
    isPoster!: boolean

    @ManyToOne(() => Play, play => play.playImages)
    @JoinColumn({ name: 'id_play' })
    play!: Play

    @ManyToOne(() => Image, image => image.playImages)
    @JoinColumn({ name: 'id_image' })
    image!: Image 
}