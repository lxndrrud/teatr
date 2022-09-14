import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from'typeorm'
import { EmailingType } from './emailing_types'
import { User } from './users'

@Entity({ name: 'users_restorations', orderBy: { timeCreated: "DESC" } })
export class UserRestoration {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'time_created' })
    timeCreated!: string

    @Column()
    code!: string

    @Column({ name: 'id_user' })
    idUser!: number

    @Column({ name: 'id_emailing_type' })
    idEmailingType!: number

    @ManyToOne(() => User, (user) => user.userRestorations )
    @JoinColumn({ name: 'id_user' })
    user!: User 

    @ManyToOne(() => EmailingType, (emailType) => emailType.userRestorations)
    @JoinColumn({ name: 'id_emailing_type' })
    emailingType!: EmailingType

}