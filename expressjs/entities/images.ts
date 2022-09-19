import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { PlayImage } from './plays_images'

@Entity({ name: 'images' })
export class Image {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    filepath!: string
    
    @OneToMany(() => PlayImage, playImage => playImage.image)
    playImages!: PlayImage[] 
}