import { DataSource } from "typeorm";
import { Role } from "../entities/roles";


export interface IRoleRepo {
    getRole(idRole: number): Promise<Role | null>
    getRoleByTitle(title: string): Promise<Role | null>
}

export class RoleRepo implements IRoleRepo {
    private connection
    private roleRepo

    constructor(
        connectionInstance: DataSource
    ) {
        this.connection = connectionInstance
        this.roleRepo = this.connection.getRepository(Role)
    }

    private roleQuery() {
        return this.connection.createQueryBuilder(Role, 'r')
            .leftJoinAndSelect('r.rolePermissions', 'rp')
            .leftJoinAndSelect('rp.permission', 'p')
    }

    public async getRole(idRole: number) {
        return this.roleQuery().where('r.id = :idRole', { idRole }).getOne()
    }

    public async getRoleByTitle(title: string) {
        return this.roleQuery().where('r.title = :title', { title }).getOne()
    }
}