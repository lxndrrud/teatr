import moment from "moment"
import { DataSource } from "typeorm"
import { User } from "../entities/users"
import { UserRestoration } from "../entities/users_restorations"
import { UserAction } from "../entities/user_actions"
import { IPermissionChecker } from "../infrastructure/PermissionChecker.infra"
import { InnerError } from "../interfaces/errors"
import { IUserPersonalInfo, UserBaseInterface, UserRequestOption } from "../interfaces/users"
import { IHasher } from "../utils/hasher"
import { ITokenizer } from "../utils/tokenizer"
import { IEmailingTypeRepo } from "./EmailingType.repo"

export interface IUserRepo {
    getUser(idUser: number): Promise<User | null>
    getUserByEmail(email: string): Promise<User | null>
    getAllUsers(): Promise<User[]>
    updatePassword(idUser: number, unhashedPassword: string): Promise<void>
    updatePersonalInfo(idUser: number, payload: IUserPersonalInfo): Promise<void>
    createUserAction(idUser: number, actionDescription: string): Promise<void>
    checkCanResendRestorEmail(idUser: number): Promise<boolean>
    checkCanRepeatRestorEmail(idUser: number): Promise<boolean>
    createUserRestoration(idUser: number, code: string): Promise<void>
    getLastUserRestoration(idUser: number): Promise<UserRestoration | null>
    createUser(payload: UserBaseInterface): Promise<User>
    generateToken(idUser: number): Promise<User>
    getTimeLeftForResendLastRestoration(idUser: number): Promise<number>
}

export class UserRepo implements IUserRepo {
    private connection
    private userRepo
    private emailingTypeRepo
    private userRestorationRepo
    private hasher
    private permissionChecker
    private tokenizer

    constructor(
        connectionInstance: DataSource,
        emailingTypeRepoInstance: IEmailingTypeRepo,
        hasherInstance: IHasher,
        permissionCheckerInstance: IPermissionChecker,
        tokenizerInstance: ITokenizer,
    ) {
        this.connection = connectionInstance
        this.userRepo = this.connection.getRepository(User)
        this.emailingTypeRepo = emailingTypeRepoInstance
        this.userRestorationRepo = this.connection.getRepository(UserRestoration)
        this.hasher = hasherInstance
        this.permissionChecker = permissionCheckerInstance
        this.tokenizer = tokenizerInstance
    }

    private userQuery() {
        return this.connection.createQueryBuilder(User, 'user')
            .innerJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('role.rolePermissions', 'rp')
            .leftJoinAndSelect('rp.permission', 'perm')
    }

    public async generateToken(idUser: number) {
        const user = await this.getUser(idUser)
        if (!user) throw new InnerError('Пользователь не найден!', 404)

        user.token = this.tokenizer.sign(<UserRequestOption> {
            id: user.id,
            id_role: user.idRole,
            email: user.email
        }, {
            expiresIn: "2h",
        })

        return await this.userRepo.save(user)
    }

    public async updatePassword(idUser: number, unhashedPassword: string) {
        // Получить пользователя
        const user = await this.getUser(idUser)
        if (!user) throw new InnerError("Пользователь не найден.", 404)
        // Захешировать пароль
        const hashedPassword = await this.hasher.hash(unhashedPassword)
        // Обновить и сохранить
        user.password = hashedPassword
        await this.userRepo.save(user)
    }

    public async updatePersonalInfo(idUser: number, payload: IUserPersonalInfo) {
        // Получить пользователя
        const user = await this.getUser(idUser)
        if (!user) throw new InnerError("Пользователь не найден.", 404)
        // Изменить данные
        user.firstname = payload.firstname
        user.middlename = payload.middlename
        user.lastname = payload.lastname
        // Сохранить
        await this.userRepo.save(user)
    }

    public async createUser(payload: UserBaseInterface) {
        const newUser = new User()
        newUser.email = payload.email
        newUser.password = await this.hasher.hash(payload.password)
        newUser.idRole = payload.id_role
        if (payload.firstname) newUser.firstname = payload.firstname
        if (payload.middlename) newUser.middlename = payload.middlename
        if (payload.lastname) newUser.lastname = payload.lastname

        return await this.userRepo.save(newUser)
    }

    public async getUser(idUser: number) {
        return this.userQuery()
            .where('user.id = :idUser', { idUser })
            .getOne()
    }

    public async getUserByEmail(email: string) {
        return this.userQuery()
            .where('user.email = :email', { email })
            .getOne()
    }

    public async getAllUsers() {
        return this.userQuery()
            .getMany()
    }

    public async createUserRestoration(idUser: number, code: string) {
        const emailingType = await this.emailingTypeRepo.getUserRestorationType()
        if (!emailingType) throw new InnerError('Тип рассылки не найден.', 404)

        const newRestoration = new UserRestoration()
        newRestoration.emailingType = emailingType
        newRestoration.idUser = idUser
        newRestoration.code = code

        await this.connection.manager.save(newRestoration)
    }

    public async getLastUserRestoration(idUser: number) {
        const emailingType = await this.emailingTypeRepo.getUserRestorationType()
        if (!emailingType) throw new InnerError('Тип рассылки не найден', 404)

        const lastRestoration = await this.userRestorationRepo.findOne({
            where: {
                idUser: idUser,
                idEmailingType: emailingType.id
            },
            relations: {
                user: true
            }
        })

        return lastRestoration
    }

    public async checkCanRepeatRestorEmail(idUser: number) {
        const user = await this.connection.createQueryBuilder(User, 'user')
            .leftJoinAndSelect('user.userRestorations', 'userRest')
            .leftJoinAndSelect('userRest.emailingType', 'et')
            .where('user.id = :idUser', { idUser })
            .getOne()

        return !!user 
            && (user.userRestorations.length === 0
                ? true
                : user.userRestorations[0].emailingType.repeatable 
                    && moment().isSameOrAfter(moment(user?.userRestorations[0].timeCreated)
                        .add(user?.userRestorations[0].emailingType.repeatInterval, 'seconds')))
    }

    public async checkCanResendRestorEmail(idUser: number) {
        const user = await this.connection.createQueryBuilder(User, 'user')
            .leftJoinAndSelect('user.userRestorations', 'userRest')
            .leftJoinAndSelect('userRest.emailingType', 'et')
            .where('user.id = :idUser', { idUser })
            .getOne()
        return !!user 
            && (user.userRestorations.length === 0
                ? false
                : moment().isSameOrAfter(moment(user?.userRestorations[0].timeCreated)
                        .add(user?.userRestorations[0].emailingType.resendInterval, 'seconds')))
    }

    public async getTimeLeftForResendLastRestoration(idUser: number) {
        const query = await this.connection.createQueryBuilder(UserRestoration, 'ur')
            .innerJoinAndSelect('ur.user', 'user')
            .innerJoinAndSelect('ur.emailingType', 'et')
            .orderBy('ur.timeCreated', 'DESC')
            .where('user.id = :idUser', { idUser })
            .getOne()
        if (!query) throw new InnerError('Восстановление не найдено!', 404)
        return moment(query.timeCreated).add(query.emailingType.resendInterval, 'seconds').diff(moment())
    }

    public async createUserAction(idUser: number, actionDescription: string) {
        // Получение пользователя
        const user = await this.getUser(idUser)
        if (!user) throw new InnerError('Оператор не определен', 404)
        // Проверка прав
        if (!(await this.permissionChecker.check_CanCreateUserActions(user)))
            throw new InnerError('Вы не можете записывать действия в журнал.', 403)

        const newAction = new UserAction()
        newAction.user = user
        newAction.description = actionDescription

        await this.connection.manager.save(newAction)
    }
} 