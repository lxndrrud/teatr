import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from'typeorm'
import { Permission } from './permissions'
import { Role } from './roles'


@Entity({ name: 'roles_permissions' })
export class RolePermission {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'id_role' })
    idRole!: number

    @Column({ name: 'id_permission' })
    idPermission!: number

    @ManyToOne(() => Role, (role) => role.rolePermissions)
    @JoinColumn({ name: 'id_role' })
    role!: Role

    @ManyToOne(() => Permission, (perm) => perm.rolePermissions)
    @JoinColumn({ name: 'id_permission' })
    permission!: Permission
}