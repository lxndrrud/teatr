import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from'typeorm'
import { User } from './users'
 

@Entity({ name: 'user_actions' })
export class UserAction {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    description!: string

    @Column({ name: 'created_at' })
    createdAt!: string

    @Column({ name: 'id_user' })
    idUser!: number

    @ManyToOne(() => User, (user) => user.userActions)
    @JoinColumn({ name: 'id_user' })
    user!: User 
}