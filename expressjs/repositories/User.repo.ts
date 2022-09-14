import moment from "moment"
import { DataSource } from "typeorm"
import { User } from "../entities/users"
import { UserRestoration } from "../entities/users_restorations"
import { UserAction } from "../entities/user_actions"
import { IEmailingTypeRepo } from "./EmailingType.repo"

export interface IUserRepo {
    getUser(idUser: number): Promise<User | null>
    getUserByEmail(email: string): Promise<User | null>
    getAllUsers(): Promise<User[]>
    createUserAction(user: User, actionDescription: string): Promise<void>
    checkCanSendRestorEmail(idUser: number): Promise<boolean>
    createUserRestoration(idUser: number, code: string): Promise<undefined>
}

export class UserRepo implements IUserRepo {
    private connection
    private userRepo
    private emailingTypeRepo

    constructor(
        connectionInstance: DataSource,
        emailingTypeRepoInstance: IEmailingTypeRepo
    ) {
        this.connection = connectionInstance
        this.userRepo = this.connection.getRepository(User)
        this.emailingTypeRepo = emailingTypeRepoInstance
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

    public async createUserRestoration(idUser: number, code: string) {
        const emailingType = await this.emailingTypeRepo.getUserRestorationType()
        if (!emailingType) return Promise.reject('Тип рассылки не найден!')

        const newRestoration = new UserRestoration()
        newRestoration.emailingType = emailingType
        newRestoration.idUser = idUser
        newRestoration.code = code

        await this.connection.manager.save(newRestoration)
    }

    public async checkCanSendRestorEmail(idUser: number) {
        const user = await this.connection.createQueryBuilder(User, 'user')
            .leftJoinAndSelect('user.userRestorations', 'userRest')
            .leftJoinAndSelect('userRest.emailingType', 'et')
            .where('user.id = :idUser', { idUser })
            .getOne()

        return !!user 
            && user.userRestorations.length === 0
                ? true
                : moment().isSameOrAfter(moment(user?.userRestorations[0].timeCreated)
                    .add(user?.userRestorations[0].emailingType.interval, 'seconds'))
    }

    public async createUserAction(user: User, actionDescription: string) {
        const newAction = new UserAction()
        newAction.user = user
        newAction.description = actionDescription

        await this.connection.manager.save(newAction)
    }
} 