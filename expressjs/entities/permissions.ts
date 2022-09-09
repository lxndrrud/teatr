import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from'typeorm'
import { RolePermission } from './roles_permissions'


@Entity({ name: 'permissions' })
export class Permission {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column({ unique: true })
    code!: string

    @OneToMany(() => RolePermission, (rolePerm) => rolePerm.permission)
    rolePermissions!: RolePermission[]
}