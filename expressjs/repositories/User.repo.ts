import { DataSource } from "typeorm"
import { User } from "../entities/users"
import { UserAction } from "../entities/user_actions"

export interface IUserRepo {
    getUser(idUser: number): Promise<User | null>
    getUserByEmail(email: string): Promise<User | null>
    getAllUsers(): Promise<User[]>
    createUserAction(user: User, actionDescription: string): Promise<void>
}

export class UserRepo implements IUserRepo {
    private connection

    constructor(
        connectionInstance: DataSource
    ) {
        this.connection = connectionInstance
    }

    public async getUser(idUser: number) {
        return this.connection.createQueryBuilder(User, 'user')
            .innerJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('role.rolePermissions', 'rp')
            .leftJoinAndSelect('rp.permission', 'perm')
            .where('user.id = :idUser', { idUser })
            .getOne()
    }

    public async getUserByEmail(email: string) {
        return this.connection.createQueryBuilder(User, 'user')
            .innerJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('role.rolePermissions', 'rp')
            .leftJoinAndSelect('rp.permission', 'perm')
            .where('user.email = :email', { email })
            .getOne()
    }

    public async getAllUsers() {
        return this.connection.createQueryBuilder(User, 'user')
            .innerJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('role.rolePermissions', 'rp')
            .leftJoinAndSelect('rp.permission', 'perm')
            .getMany()
    }

    public async createUserAction(user: User, actionDescription: string) {
        const newAction = new UserAction()
        newAction.user = user
        newAction.description = actionDescription

        await this.connection.manager.save(newAction)
    }
} 