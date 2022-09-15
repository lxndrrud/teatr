import { UserModel } from "../../dbModels/users";
import { IExtendedUser, IUserChangePassword, IUserPersonalInfo, UserBaseInterface, UserInterface, UserLoginInterface, UserRegisterInterface, UserRequestOption, UserStrategy } from "../../interfaces/users";
import { RoleService } from "../roles";
import { InnerErrorInterface, isInnerErrorInterface } from "../../interfaces/errors";
import { IUserInfrastructure } from "../../infrastructure/User.infra";
import { Knex } from "knex";
import { IUserGuard } from "../../guards/User.guard";
import { CodeGenerator } from "../../utils/code";
import { EmailSender } from "../../utils/email";
import { Hasher } from "../../utils/hasher";
import { IUserRepo } from "../../repositories/User.repo";
import { User } from "../../entities/users";
import { PermissionChecker } from "../../infrastructure/PermissionChecker.infra";


export interface IUserCRUDService {
    createUser(payload: UserRegisterInterface): Promise<InnerErrorInterface | UserInterface>
    loginUser(payload: UserLoginInterface): Promise<InnerErrorInterface | {
        token: string;
        isAdmin: boolean;
    }>
    loginAdmin(payload: UserLoginInterface): Promise<string | InnerErrorInterface>
    getAll(): Promise<InnerErrorInterface | {
        id: number;
        id_role: number;
        role_title: string;
        email: string;
        firstname: string;
        middlename: string;
        lastname: string;
    }[]>
    getPersonalArea(user: UserRequestOption): 
    Promise<{
            email: string;
            firstname: string;
            middlename: string;
            lastname: string;
        } | InnerErrorInterface>
    getUser(user: UserRequestOption, idUser: number): Promise<InnerErrorInterface | {
            id: number;
            id_role: number;
            role_title: string;
            email: string;
            firstname: string;
            middlename: string;
            lastname: string;
        }>
    changePassword(user: UserRequestOption, passwordInfo: IUserChangePassword): 
    Promise<InnerErrorInterface | undefined>
    changePersonalInfo(user: UserRequestOption, personalInfo: IUserPersonalInfo): Promise<InnerErrorInterface | undefined>
    restorePasswordByEmail(email: string): Promise<InnerErrorInterface | undefined>
    resendRestorationEmail(email: string): Promise<InnerErrorInterface | undefined>
}

export class UserFetchingModel implements IUserCRUDService {
    protected connection
    protected userModel
    protected roleFetchingInstance
    protected userInfrastructure
    protected userGuard
    protected codeGenerator
    protected emailSender
    protected hasher
    protected userRepo
    protected permissionChecker

    constructor(
        connectionInstance: Knex<any, unknown[]>,
        userModelInstance: UserModel, 
        roleServiceInstance: RoleService,
        userInfrastructureInstance: IUserInfrastructure,
        userGuardInstance: IUserGuard,
        codeGeneratorInstance: CodeGenerator,
        emailSenderInstance: EmailSender,
        hasherInstance: Hasher,
        userRepo: IUserRepo,
        permissionCheckerInstance: PermissionChecker
    ) {
        this.connection = connectionInstance
        this.userModel = userModelInstance
        this.roleFetchingInstance = roleServiceInstance
        this.userInfrastructure = userInfrastructureInstance
        this.userGuard = userGuardInstance
        this.codeGenerator = codeGeneratorInstance
        this.emailSender = emailSenderInstance
        this.hasher = hasherInstance
        this.userRepo = userRepo
        this.permissionChecker = permissionCheckerInstance
    }

    async createUser(payload: UserRegisterInterface) {
        try {
            // Проверка на существующего пользователя
            const existingUserCheck = <IExtendedUser | undefined> await this.userModel
                .get({ email: payload.email})
            if (existingUserCheck) {
                return <InnerErrorInterface>{
                    code: 409,
                    message: 'Пользователь с такой почтой уже существует!'
                }
            }
        } catch (e) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Возникла внутренняя ошибка с проверкой существующего пользователя!'
            }
        }
            
        // Получаем роль "Посетитель" из базы данных
        const visitorRole = await this.roleFetchingInstance.getVisitorRole()
        if (isInnerErrorInterface(visitorRole)) {
            return visitorRole
        }
        const fetchedRequestBody: UserBaseInterface = {...payload, id_role: visitorRole.id}

        // Транзакция: создать пользователя, затем дать ему токен
        const trx = await this.connection.transaction()
        try {
            fetchedRequestBody.password = await this.hasher.hash(payload.password)
            let user: UserInterface = (await this.userModel.insert(trx, fetchedRequestBody))[0]
            const withTokenUser = await this.userInfrastructure.generateToken(trx, user)
            if (isInnerErrorInterface(withTokenUser)) {
                return withTokenUser
            }
            user = withTokenUser
            await trx.commit()
            return user
        } catch (e) {
            await trx.rollback()
            console.log(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера в транзакции создания пользователя!'
            }
        }
    }

    /**
     * * Логика обычного логина  
     */
    async loginUser(payload: UserLoginInterface) {
        // Получение пользователя и сравнение введенного пароля с хэшем в базе
        let user: IExtendedUser | undefined 
        try {
            user = await this.userModel.get({email: payload.email})
        } catch (e) {
            return <InnerErrorInterface> {
                code: 500,
                message: "Внутренняя ошибка при поиске пользователя: " + e 
            }
        }

        // Проверка пароля
        if (!(user && this.hasher.check(payload.password, user.password))) {
            return <InnerErrorInterface>{
                code: 401,
                message: 'Пользователь с такими входными данными не найден!'
            }
        }

        // Получение роли адмиинистратора
        let adminRole = await this.roleFetchingInstance.getAdminRole()
        if (isInnerErrorInterface(adminRole)) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске роли!'
            }
        }

        // Проверка роли пользователя на соответствие роли администратора
        let isAdmin = false
        if (user.id_role === adminRole.id) {
            isAdmin = true
        }
        // Транзакция: сгенерировать токен для пользователя, сохранить в БД
        const trx = await this.connection.transaction()
        try {
            const fetchedUser = await this.userInfrastructure.generateToken(trx, user)
            if (isInnerErrorInterface(fetchedUser)) {
                await trx.rollback()
                return fetchedUser
            }
            await trx.commit()
            if (!fetchedUser.token) {
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера при генерации токена!'
                }
            }
            return {
                token: <string> fetchedUser.token,
                isAdmin
            }
        } catch (e) {
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера в транзакции логина!'
            }
        }  
    }

    /**
     * * Логика логина для администраторской части сайта
     */
    async loginAdmin(payload: UserLoginInterface) {
        // Получение пользователя и сравнение введенного пароля с хэшем в базе
        let user: IExtendedUser | undefined
        try {
            user = await this.userModel.get({email: payload.email})
        } catch (e) {
            return <InnerErrorInterface> {
                code: 500,
                message: "Внутренняя ошибка при поиске пользователя!"
            }
        }
        // Проверка пароля
        if (!(user && this.hasher.check(payload.password, user.password))) {
            return <InnerErrorInterface>{
                code: 401,
                message: 'Пользователь с такими входными данными не найден!'
            }
        }
        // Получение роли адмиинистратора
        let role = await this.roleFetchingInstance.getAdminRole()
        if (isInnerErrorInterface(role)) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при поиске роли!'
            }
        }
        // Проверка роли пользователя на соответствие роли администратора
        if (user.id_role !== role.id) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Вход запрещен!'
            }
        }
        // Транзакция: сгенерировать токен для пользователя, сохранить в БД
        const trx = await this.connection.transaction()
        try {
            const fetchedUser = await this.userInfrastructure.generateToken(trx, user)
            if (isInnerErrorInterface(fetchedUser)) {
                await trx.rollback()
                return fetchedUser
            }
            await trx.commit()
            if (!fetchedUser.token) {
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера при генерации токена!'
                }
            }
            return <string> fetchedUser.token
        } catch (e) {
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера в транзакции логина!'
            }
        }  
    }

    /**
     * * Получение списка пользователей
     */
    async getAll() {
        try {
            const query = <IExtendedUser[]> await this.userModel.getAll({})
            return UserStrategy.getExtendedPersonalList(query)
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500, 
                message: 'Внутренняя ошибка сервера при получении всех пользователей'
            }
        }
    }

    /**
     * * Личный кабинет
     */
    async getPersonalArea(user: UserRequestOption) {
        const userInfo = await this.userInfrastructure.getExtendedUser(user.id)
        if (isInnerErrorInterface(userInfo)) {
            return userInfo
        }
        if (!userInfo) {
            return <InnerErrorInterface> {
                code: 404,
                message: "Пользователь не найден!"
            } 
        }
        return new UserStrategy(userInfo).getPersonalInfo()
    } 
    
    /**
     * * Расширенная информация о пользователях (уровень "Оператор", "Администратор")
     */
    async getUser(user: UserRequestOption, idUser: number) {
        const check = await this.userInfrastructure.checkIsUserStaff(user)
        if (isInnerErrorInterface(check)) {
            return check
        }
        if (!check) {
            return <InnerErrorInterface> {
                code: 403,
                message: "У вас нет доступа для просмотра информации о других пользователях!"
            }
        }
        const userInfo = await this.userInfrastructure.getExtendedUser(idUser)
        if (isInnerErrorInterface(userInfo)) {
            return userInfo
        }
        if (!userInfo) {
            return <InnerErrorInterface> {
                code: 404,
                message: "Пользователь не найден!"
            }
        }
        return new UserStrategy(userInfo).getExtendedPersonalInfo()
    }
    
    /**
     * * Логика изменения пароля 
     */
    async changePassword(user: UserRequestOption, passwordInfo: IUserChangePassword ) {
        const validation = this.userGuard.changePasswordValidation(passwordInfo)
        if (isInnerErrorInterface(validation)) {
            return validation
        }

        // Поиск пользователя в базе по информации из токена
        const userInfo = await this.userInfrastructure.getExtendedUser(user.id)
        if (isInnerErrorInterface(userInfo)) {
            return userInfo
        }
        if (!userInfo) {
            return <InnerErrorInterface> {
                code: 404,
                message: "Пользователь не найден!"
            }
        }

        // Проверка на совпадение старого пароля с паролем из базы
        if (!this.hasher.check(passwordInfo.oldPassword, userInfo.password)) {
            return <InnerErrorInterface>{
                code: 400,
                message: "Старый пароль введён неверно!"
            }
        }

        // Шифрование нового пароля
        let newPasswordHash: string
        try {
            newPasswordHash = await this.hasher.hash(passwordInfo.newPassword)
        } catch(e) {
            console.error(e)
            return <InnerErrorInterface>{
                code: 500,
                message: "Ошибка при хэшировании пароля!"
            }
        }

        const trx = await this.connection.transaction()
        try {
            await this.userModel.update(trx, user.id, <UserInterface> {
                password: newPasswordHash
            })
            await trx.commit()
        } catch (e) {
            console.error(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: "Внутренняя ошибка при смене пароля!"
            }
        }
    }

    /**
     * * Логика изменения личной информации
     */
    async changePersonalInfo(user: UserRequestOption, personalInfo: IUserPersonalInfo) {
        // Валидация 
        personalInfo = this.userGuard.changePersonalInfoProcessing(personalInfo)


        // Нахождение пользователя в базе
        let userInfo = await this.userInfrastructure.getExtendedUser(user.id)
        if (isInnerErrorInterface(userInfo)) {
            return userInfo
        }
        if (!userInfo) {
            return <InnerErrorInterface> {
                code: 404,
                message: "Пользователь не найден!"
            }
        }
        // Транзакция: изменение личных данных пользователя
        const trx = await this.connection.transaction()
        try {
            await this.userModel.update(trx, user.id, <UserInterface>{
                firstname: personalInfo.firstname,
                middlename: personalInfo.middlename,
                lastname: personalInfo.lastname
            })
            await trx.commit()
        } catch (e) {
            console.error(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка при изменении личных данных пользователя!'
            }
        }
    }

    /**
     * * Логика восстановления пароля при помощи почты
     */
    async restorePasswordByEmail(email: string) {
        // Найти пользователя по почте
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUserByEmail(email)
            .catch(e => { throw e })
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        // Пользователь не найден
        if (!userDB) {
            return <InnerErrorInterface> {
                code: 404,
                message: 'Пользователь не найден!'
            }
        }
        // Проверка разрешения на восстановление
        if (!(await this.permissionChecker.check_CanRestorePasswordByEmail(userDB))) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Вы не можете пользоваться восстановлением пароля по почте! Пожалуйста, обратитесь к администратору.'
            }
        }
        // Проверка предыдущего восстановления и его таймаута
        if (!(await this.userRepo.checkCanRepeatRestorEmail(userDB.id))) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Пока что Вы еще не можете пользоваться восстановлением пароля по почте!'
            }
        }
        // Сгенерить новый пароль,сохранить его, создать запись о восстановлении и отправить письмо с паролем на почту
        const newPassword = this.codeGenerator.generateCode()
        const trx = await this.connection.transaction()
        try {
            const newPasswordHashed = await this.hasher.hash(newPassword)
            await this.userModel.update(trx, userDB.id, <UserInterface>{
                password: newPasswordHashed
            })
            await this.userRepo.createUserRestoration(userDB.id, newPassword)
                .catch((e) => { throw e })
            await trx.commit()
            const emailInfo = this.userInfrastructure.generateRestorePasswordEmailMessage(newPassword)
            this.emailSender.send(
                userDB.email, 
                emailInfo.subject, 
                emailInfo.message
            )
            .catch(e => console.error(e))
        } catch( e) {
            console.error(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500, 
                message: 'Внутренняя ошибка во время восстановления пароля!'
            }
        }
    }

    /**
     * * Логика повторной отправки письма для восстановления пароля по почте
     */
    async resendRestorationEmail(email: string) {
         // Найти пользователя по почте
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUserByEmail(email)
                .catch(e => { throw e })
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        // Пользователь не найден
        if (!userDB) {
            return <InnerErrorInterface> {
                code: 404,
                message: 'Пользователь не найден!'
            }
        }
        // Проверка разрешения на восстановление
        if (!(await this.permissionChecker.check_CanRestorePasswordByEmail(userDB))) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Вы не можете пользоваться восстановлением пароля по почте! Пожалуйста, обратитесь к администратору.'
            }
        }
        // Получение последнего восстановления пароля по почте
        const lastRestoration = await this.userRepo.getLastUserRestoration(userDB.id)
        if (!lastRestoration) {
            return <InnerErrorInterface> {
                code: 404,
                message: "Ваше последнее восстановление пароля не найдено. Попробуйте воспользоваться восстановление на странице входа."
            }
        }
        // Проверка таймаута последней отправки письма на почту
        if (!(await this.userRepo.checkCanResendRestorEmail(userDB.id))) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Вы сможете повторно запросить письмо на почту спустя определенный временной интервал.'
            }
        }
        // Сгенерировать письмо и отправить повторно        
        const emailInfo = this.userInfrastructure.generateRestorePasswordEmailMessage(lastRestoration.code)
        this.emailSender.send(
            userDB.email, 
            emailInfo.subject, 
            emailInfo.message
        )
        .catch(e => console.error(e))
    }
}
