import { Knex } from "knex";
import { KnexConnection } from "../knex/connections";
import { UserDatabaseInstance } from "../dbModels/users";
import { hash, compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken'
import { UserBaseInterface, UserInterface, UserLoginInterface, UserRegisterInterface, UserRequestOption } from "../interfaces/users";
import { RoleFetchingInstance } from "./roles";
import { users } from "../dbModels/tables";
import { InnerErrorInterface, isInnerErrorInterface } from "../interfaces/errors";

class UserFetchingModel {
    protected userDatabaseInstance
    protected roleFetchingInstance

    constructor() {
        this.userDatabaseInstance = UserDatabaseInstance
        this.roleFetchingInstance = RoleFetchingInstance
    }

    generateToken (trx: Knex.Transaction, user: UserInterface) {
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
        return trx<UserInterface>(users)
            .where({
                id: user.id
            })
            .update({
                token
            })
            .returning('*')
    }



    async createUser(payload: UserRegisterInterface) {
        // * Проверка на существующего пользователя
        const existingUserCheck: UserInterface = await this.userDatabaseInstance
            .get({ email: payload.email})
        if (existingUserCheck) {
            return <InnerErrorInterface>{
                code: 409,
                message: 'Пользователь с такой почтой уже существует!'
            }
        }
        // * Получаем роль "Посетитель" из базы данных
        const visitorRole = await this.roleFetchingInstance.getVisitorRole()
        if (isInnerErrorInterface(visitorRole)) {
            return visitorRole
        }
        const fetchedRequestBody: UserBaseInterface = {...payload, id_role: visitorRole.id}
        // * Транзакция: создать пользователя, затем дать ему токен
        const trx = await KnexConnection.transaction()
        try {
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

    async loginUser (payload: UserLoginInterface) {
        // Получение пользователя и сравнение введенного пароля с хэшем в базе
        const user: UserInterface = await this.userDatabaseInstance.get({email: payload.email})
        if (!(user && compareSync(payload.password, user.password))) {
            return 401
        }
        // Транзакция: сгенерировать токен для пользователя, сохранить в БД
        const trx = await KnexConnection.transaction()
        try {
            const fetchedUser = (await this.generateToken(trx, user))[0]
            await trx.commit()
            if (!fetchedUser.token) return 500
            return fetchedUser.token
        } catch (e) {
            await trx.rollback()
            console.log(e)
            return 500
        }  
    }

    async getAll() {
        try {
            const query: UserInterface[] = await this.userDatabaseInstance.getAll({})
            return query
        } catch (e) {
            console.log(e)
            return 500
        }
    }

}

export const UserFetchingInstance = new UserFetchingModel()