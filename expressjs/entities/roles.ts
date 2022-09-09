import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne } from'typeorm'
import { RolePermission } from './roles_permissions'
import { User } from './users'

@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @OneToMany(() => RolePermission, (rolePerm) => rolePerm.role)
    rolePermissions!: RolePermission[]

    @OneToOne(() => User, (user) => user.role)
    user!: User 
}