import { IUserChangePassword, IUserPersonalInfo, UserBaseInterface,  UserLoginInterface, UserRegisterInterface, UserRequestOption, UserStrategy } from "../../interfaces/users";
import { InnerError, InnerErrorInterface, isInnerErrorInterface } from "../../interfaces/errors";
import { IUserInfrastructure } from "../../infrastructure/User.infra";
import { Knex } from "knex";
import { IUserGuard } from "../../guards/User.guard";
import { CodeGenerator } from "../../utils/code";
import { EmailSender } from "../../utils/email";
import { Hasher } from "../../utils/hasher";
import { IUserRepo } from "../../repositories/User.repo";
import { User } from "../../entities/users";
import { PermissionChecker } from "../../infrastructure/PermissionChecker.infra";
import { IRoleRepo } from "../../repositories/Role.repo";


export interface IUserCRUDService {
    createUser(payload: UserRegisterInterface): Promise<User>
    loginUser(payload: UserLoginInterface): Promise<{
        token: string;
        isAdmin: boolean;
    }>
    getAll(): Promise<InnerErrorInterface | {
        id: number;
        id_role: number;
        role_title: string;
        email: string;
        firstname: string;
        middlename: string;
        lastname: string;
    }[]>
    getPersonalArea(user: UserRequestOption): Promise<{
        email: string;
        firstname: string;
        middlename: string;
        lastname: string;
    }>
    getUser(user: UserRequestOption, idUser: number): Promise<{
        id: number;
        id_role: number;
        role_title: string;
        email: string;
        firstname: string;
        middlename: string;
        lastname: string;
    }>
    changePassword(user: UserRequestOption, passwordInfo: IUserChangePassword): Promise<void>
    changePersonalInfo(user: UserRequestOption, personalInfo: IUserPersonalInfo): Promise<void>
    restorePasswordByEmail(email: string): Promise<void>
    resendRestorationEmail(email: string): Promise<void>
}

export class UserFetchingModel implements IUserCRUDService {
    protected connection
    protected userInfrastructure
    protected userGuard
    protected codeGenerator
    protected emailSender
    protected hasher
    protected userRepo
    protected permissionChecker
    protected roleRepo

    constructor(
        connectionInstance: Knex<any, unknown[]>,
        userInfrastructureInstance: IUserInfrastructure,
        userGuardInstance: IUserGuard,
        codeGeneratorInstance: CodeGenerator,
        emailSenderInstance: EmailSender,
        hasherInstance: Hasher,
        userRepo: IUserRepo,
        permissionCheckerInstance: PermissionChecker,
        roleRepoInstance: IRoleRepo
    ) {
        this.connection = connectionInstance
        this.userInfrastructure = userInfrastructureInstance
        this.userGuard = userGuardInstance
        this.codeGenerator = codeGeneratorInstance
        this.emailSender = emailSenderInstance
        this.hasher = hasherInstance
        this.userRepo = userRepo
        this.permissionChecker = permissionCheckerInstance
        this.roleRepo = roleRepoInstance
    }

    /**
     * * Логика регистрации нового посетителя
     */
    async createUser(payload: UserRegisterInterface) {
        // Проверка существования пользователя с указанной почтой
        const checkExist = await this.userRepo.getUserByEmail(payload.email)
        if (checkExist) throw new InnerError('Пользователь с такой почтой уже существует.', 409)
        // Получаем роль "Посетитель" из базы данных
        const visitorRole = await this.roleRepo.getRoleByTitle('Посетитель')
        if (!visitorRole) throw new InnerError('Роль нового пользователя не распознана.', 404)
        // Создание пользователя и генерация токена
        const fetchedRequestBody: UserBaseInterface = {...payload, id_role: visitorRole.id }
        const newUser = await this.userRepo.createUser(fetchedRequestBody)
        return await this.userRepo.generateToken(newUser.id)
    }

    /**
     * * Логика логина  
     */
    async loginUser(payload: UserLoginInterface) {
        // Получение пользователя
        const user = await this.userRepo.getUserByEmail(payload.email)
        // Проверка пароля (сравнение введенного пароля с хэшем в базе)
        if (!(user && this.hasher.check(payload.password, user.password))) 
            throw new InnerError('Пользователь с такими входными данными не найден!', 401)
        // Проверка роли пользователя на соответствие роли администратора
        let isAdmin = false
        if (await this.permissionChecker.check_HasAccessToAdmin(user)) isAdmin = true
        // Генерация токена
        const fetchedUser = await this.userRepo.generateToken(user.id)
        return {
            token: <string> fetchedUser.token,
            isAdmin
        }
    }

    /**
     * * Получение списка пользователей
     */
    async getAll() {
        const users = await this.userRepo.getAllUsers()
        return UserStrategy.getExtendedPersonalList(users)
    }

    /**
     * * Личный кабинет
     */
    async getPersonalArea(user: UserRequestOption) {
        const userInfo = await this.userRepo.getUser(user.id)
        if (!userInfo) throw new InnerError("Пользователь не найден!", 404)
        return new UserStrategy(userInfo).getPersonalInfo()
    } 
    
    /**
     * * Расширенная информация о пользователях (уровень "Оператор", "Администратор")
     */
    async getUser(user: UserRequestOption, idUser: number) {
        // Получение пользователя-оператора из базы
        const userDB = await this.userRepo.getUser(user.id)
        if (!userDB) throw new InnerError('Оператор не найден.', 404)
        // Проверка прав на просмотр личной информацииs
        if (!(await this.permissionChecker.check_CanSeeUsersPersonalInfo(userDB))) 
            throw new InnerError("У вас нет доступа для просмотра информации о других пользователях!", 403)
        // Получение пользователя по запросу
        const userInfo = await this.userRepo.getUser(idUser)
        if (!userInfo) throw new InnerError('Пользователь не найден.', 404)
        return new UserStrategy(userInfo).getExtendedPersonalInfo()
    }
    
    /**
     * * Логика изменения пароля 
     */
    async changePassword(user: UserRequestOption, passwordInfo: IUserChangePassword ) {
        // Валидация запроса
        this.userGuard.changePasswordValidation(passwordInfo)
        // Поиск пользователя в базе по информации из токена
        const userInfo = await this.userRepo.getUser(user.id)
        if (!userInfo) throw new InnerError("Пользователь не найден!", 404)
        // Проверка на совпадение старого пароля с паролем из базы
        if (!this.hasher.check(passwordInfo.oldPassword, userInfo.password))
            throw new InnerError("Старый пароль введён неверно!", 400)
        // Захешировать и сохранить 
        await this.userRepo.updatePassword(user.id, passwordInfo.newPassword)
    }

    /**
     * * Логика изменения личной информации
     */
    async changePersonalInfo(user: UserRequestOption, personalInfo: IUserPersonalInfo) {
        // Валидация 
        personalInfo = this.userGuard.changePersonalInfoProcessing(personalInfo)
        // Изменение
        await this.userRepo.updatePersonalInfo(user.id, personalInfo)
    }

    /**
     * * Логика восстановления пароля при помощи почты
     */
    async restorePasswordByEmail(email: string) {
        // Получение пользователя
        const user = await this.userRepo.getUserByEmail(email)
        if (!user) throw new InnerError("Пользователь не найден.", 404)
        // Проверка разрешения на восстановление
        if (!(await this.permissionChecker.check_CanRestorePasswordByEmail(user))) 
            throw new InnerError('Вы не можете пользоваться восстановлением пароля по почте! Пожалуйста, обратитесь к администратору.', 
                403)
        // Проверка предыдущего восстановления и его таймаута
        if (!(await this.userRepo.checkCanRepeatRestorEmail(user.id)))
            throw new InnerError('Пока что Вы еще не можете пользоваться восстановлением пароля по почте!', 403)
        // Сгенерить новый пароль,сохранить его, создать запись о восстановлении
        const newPassword = this.codeGenerator.generateCode()
        await Promise.all([
            this.userRepo.updatePassword(user.id, newPassword),
            this.userRepo.createUserRestoration(user.id, newPassword)
        ])
        // Отправить письмо с паролем на почту
        const emailInfo = this.userInfrastructure.generateRestorePasswordEmailMessage(newPassword)
        this.emailSender.send(
            user.email, 
            emailInfo.subject, 
            emailInfo.message
        )
        .catch(e => console.error(e))
    }

    /**
     * * Логика повторной отправки письма для восстановления пароля по почте
     */
    async resendRestorationEmail(email: string) {
        // Получение пользователя
        const user = await this.userRepo.getUserByEmail(email)
        if (!user) throw new InnerError("Пользователь не найден.", 404)
        // Проверка разрешения на восстановление
        if (!(await this.permissionChecker.check_CanRestorePasswordByEmail(user))) 
            throw new InnerError('Вы не можете пользоваться восстановлением пароля по почте! Пожалуйста, обратитесь к администратору.',
                403)
        // Получение последнего восстановления пароля по почте
        const lastRestoration = await this.userRepo.getLastUserRestoration(user.id)
        if (!lastRestoration) 
            throw new InnerError("Ваше последнее восстановление пароля не найдено. Попробуйте воспользоваться восстановлением.", 
                404)
        // Проверка таймаута последней отправки письма на почту
        if (!(await this.userRepo.checkCanResendRestorEmail(user.id))) 
            throw new InnerError('Вы сможете повторно запросить письмо на почту спустя определенный временной интервал.', 403)
        // Сгенерировать письмо и отправить повторно        
        const emailInfo = this.userInfrastructure.generateRestorePasswordEmailMessage(lastRestoration.code)
        this.emailSender.send(
            user.email, 
            emailInfo.subject, 
            emailInfo.message
        )
        .catch(e => console.error(e))
    }
}
