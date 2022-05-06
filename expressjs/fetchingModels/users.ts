import { Knex } from "knex";
import { KnexConnection } from "../knex/connections";
import { UserModel } from "../dbModels/users";
import { hash, compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken'
import { UserBaseInterface, UserInterface, UserLoginInterface, UserRegisterInterface, UserRequestOption } from "../interfaces/users";
import { RoleService } from "./roles";
import { users } from "../dbModels/tables";
import { InnerErrorInterface, isInnerErrorInterface } from "../interfaces/errors";
import { RoleDatabaseInterface } from "../interfaces/roles";
import { UserActionBaseInterface } from "../interfaces/userActions";


export interface UserService {
    generateToken (trx: Knex.Transaction, user: UserInterface): Promise<Knex.QueryBuilder>
    createUser(payload: UserRegisterInterface): Promise<InnerErrorInterface | UserInterface>
    loginUser(payload: UserLoginInterface): Promise<string | InnerErrorInterface>
    getAll(): Promise<UserInterface[] | InnerErrorInterface>
    createAction(
        trx: Knex.Transaction, 
        idUser: number, 
        userRole: RoleDatabaseInterface, 
        description: string): Promise<InnerErrorInterface | undefined>
}

export class UserFetchingModel implements UserService {
    protected userDatabaseInstance
    protected roleFetchingInstance

    constructor(userDatabaseModel: UserModel, roleServiceInstance: RoleService) {
        this.userDatabaseInstance = userDatabaseModel
        this.roleFetchingInstance = roleServiceInstance
    }

    async generateToken (trx: Knex.Transaction, user: UserInterface) {
        const userRequestOption: UserRequestOption = {
            id: user.id,
            email: user.email,
            id_role: user.id_role
        }
        const token = sign(
            userRequestOption, 
            `${process.env.SECRET_KEY}`,
            {
                expiresIn: "2h",
            }
        )
        return await this.userDatabaseInstance.generateToken(trx, user.id, token)
    }

    async createUser(payload: UserRegisterInterface) {
        // Транзакция: создать пользователя, затем дать ему токен
        const trx = await KnexConnection.transaction()
        try {
            // Проверка на существующего пользователя
            const existingUserCheck: UserInterface = await this.userDatabaseInstance
                .get({ email: payload.email})
            if (existingUserCheck) {
                return <InnerErrorInterface>{
                    code: 409,
                    message: 'Пользователь с такой почтой уже существует!'
                }
            }
            // Получаем роль "Посетитель" из базы данных
            const visitorRole = await this.roleFetchingInstance.getVisitorRole()
            if (isInnerErrorInterface(visitorRole)) {
                return visitorRole
            }
            const fetchedRequestBody: UserBaseInterface = {...payload, id_role: visitorRole.id}
            
        
            fetchedRequestBody.password = await hash(payload.password, 10)
            let user: UserInterface = (await this.userDatabaseInstance.insert(trx, fetchedRequestBody))[0]
            user = (await this.generateToken(trx, user))[0]
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
        const user: UserInterface = await this.userDatabaseInstance.get({email: payload.email})
        if (!(user && compareSync(payload.password, user.password))) {
            return <InnerErrorInterface>{
                code: 401,
                message: 'Пользователь с такими входными данными не найден!'
            }
        }
        // Транзакция: сгенерировать токен для пользователя, сохранить в БД
        const trx = await KnexConnection.transaction()
        try {
            const fetchedUser = (await this.generateToken(trx, user))[0]
            await trx.commit()
            if (!fetchedUser.token) {
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера при генерации токена!'
                }
            }
            return fetchedUser.token
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
            const query: UserInterface[] = await this.userDatabaseInstance.getAll({})
            return query
        } catch (e) {
            console.log(e)
            return <InnerErrorInterface>{
                code: 500, 
                message: 'Внутренняя ошибка сервера при получении всех пользователей!'
            }
        }
    }

    async createAction(trx: Knex.Transaction, idUser: number, userRole: RoleDatabaseInterface, description: string) {
        if (!userRole.can_see_all_reservations) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Пользователю запрещено выполнять опасные действия!'
            }
        }

        try {
            const payload: UserActionBaseInterface = {
                id_user: idUser,
                description: description
            }
            await this.userDatabaseInstance.insertAction(trx, payload)
        } catch (e) {
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера при создании действия пользователя'
            }
        }
    }
}
