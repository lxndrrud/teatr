import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from'typeorm'
import { Role } from './roles'
import { UserAction } from './user_actions'

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true })
    email!: string

    @Column({ nullable: true })
    token!: string

    @Column()
    password!: string

    @Column()
    firstname!: string

    @Column()
    middlename!: string

    @Column()
    lastname!: string

    @Column({ name: 'id_role' }) 
    idRole!: number

    @OneToOne(() => Role, (role) => role.user)
    @JoinColumn({ name: 'id_role' })
    role!: Role 

    @OneToMany(() => UserAction, (userAction) => userAction.user)
    userActions!: UserAction[]
}