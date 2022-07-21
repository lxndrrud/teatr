import { KnexConnection } from "../knex/connections";
import { UserModel } from "../dbModels/users";
import { hash, compareSync } from 'bcryptjs';
import { IExtendedUser, UserBaseInterface, UserInterface, UserLoginInterface, UserRegisterInterface, UserRequestOption, UserStrategy } from "../interfaces/users";
import { RoleService } from "./roles";
import { InnerErrorInterface, isInnerErrorInterface } from "../interfaces/errors";
import { IUserInfrastructure } from "../infrastructure/User.infra";


export interface UserService {
    createUser(payload: UserRegisterInterface): Promise<InnerErrorInterface | UserInterface>
    loginUser(payload: UserLoginInterface): Promise<string | InnerErrorInterface>
    loginAdmin(payload: UserLoginInterface): Promise<string | InnerErrorInterface>
    getAll(): Promise<UserInterface[] | InnerErrorInterface>
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
}

export class UserFetchingModel implements UserService {
    protected userModel
    protected roleFetchingInstance
    protected userInfrastructure

    constructor(
        userModelInstance: UserModel, 
        roleServiceInstance: RoleService,
        userInfrastructureInstance: IUserInfrastructure
    ) {
        this.userModel = userModelInstance
        this.roleFetchingInstance = roleServiceInstance
        this.userInfrastructure = userInfrastructureInstance
    }

    async createUser(payload: UserRegisterInterface) {
        try {
            // Проверка на существующего пользователя
            const existingUserCheck: UserInterface = await this.userModel
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
        const trx = await KnexConnection.transaction()
        try {
            fetchedRequestBody.password = await hash(payload.password, 10)
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

    async loginUser(payload: UserLoginInterface) {
        // Получение пользователя и сравнение введенного пароля с хэшем в базе
        let user: UserInterface 
        try {
            user = await this.userModel.get({email: payload.email})
        } catch (e) {
            return <InnerErrorInterface> {
                code: 500,
                message: "Внутренняя ошибка при поиске пользователя!"
            }
        }
        if (!(user && compareSync(payload.password, user.password))) {
            return <InnerErrorInterface>{
                code: 401,
                message: 'Пользователь с такими входными данными не найден!'
            }
        }
        // Транзакция: сгенерировать токен для пользователя, сохранить в БД
        const trx = await KnexConnection.transaction()
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
     * * Логика логина для администраторской части сайта
     */
    async loginAdmin(payload: UserLoginInterface) {
        // Получение пользователя и сравнение введенного пароля с хэшем в базе
        let user: UserInterface 
        try {
            user = await this.userModel.get({email: payload.email})
        } catch (e) {
            return <InnerErrorInterface> {
                code: 500,
                message: "Внутренняя ошибка при поиске пользователя!"
            }
        }
        // Проверка пароля
        if (!(user && compareSync(payload.password, user.password))) {
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
        const trx = await KnexConnection.transaction()
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

    async getAll() {
        try {
            const query: UserInterface[] = await this.userModel.getAll({})
            return query
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500, 
                message: 'Внутренняя ошибка сервера при получении всех пользователей!'
            }
        }
    }

    /**
     * * Личный кабинет
     */
    async getPersonalArea(user: UserRequestOption) {
        try {
            const personalInfo = <IExtendedUser> await this.userModel.getUser(user.id)
            return new UserStrategy(personalInfo).getPersonalInfo() 
        } catch (e) {
            return <InnerErrorInterface> {
                code: 500,
                message: "Внутренняя ошибка при поиске пользователя: " + e
            }
        }
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
        try {
            const user = <IExtendedUser> await this.userModel.getUser(idUser)
            return new UserStrategy(user).getExtendedPersonalInfo()
        } catch (e) {
            return <InnerErrorInterface> {
                code: 500,
                message: "Внутренняя ошибка при поиске пользователя: " + e
            }
        }
    } 
}
