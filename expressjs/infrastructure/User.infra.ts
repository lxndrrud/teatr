import { Knex } from "knex";
import { UserModel } from "../dbModels/users";
import { InnerErrorInterface } from "../interfaces/errors";
import { UserInterface, UserRequestOption } from "../interfaces/users";
import { sign } from 'jsonwebtoken'
import { UserActionBaseInterface } from "../interfaces/userActions";
import { RoleDatabaseInterface } from "../interfaces/roles";

export interface IUserInfrastructure {
    checkIsUserStaff(user: UserRequestOption): Promise<boolean | InnerErrorInterface>
    generateToken(trx: Knex.Transaction, user: UserInterface): Promise<any>
    createAction(
        trx: Knex.Transaction, 
        idUser: number, 
        userRole: RoleDatabaseInterface, 
        description: string): 
    Promise<InnerErrorInterface | undefined>
}

export class UserInfrastructure implements IUserInfrastructure {
    private userModel

    constructor(
        userModelInstance: UserModel
    ) {
        this.userModel = userModelInstance
    }

    /**
     * * Генерация и запись токена в базу
     */
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
        try {
            return (await this.userModel.generateToken(trx, user.id, token))[0]
        } catch (e) {
            return <InnerErrorInterface>{
                code: 500,
                message: "Внутренняя ошибка во время генерации токена!"
            }
        }
    }

    /**
     * * Проверить явялется ли пользователь частью персонала театра
     */
    async checkIsUserStaff(user: UserRequestOption): Promise<boolean | InnerErrorInterface>  {
        try{ 
            let check = await this.userModel.checkIsUserStaff(user.id, user.id_role)
            return check ? true : false
        } catch (e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка во время авторизации: ' + e
            }
        }
    }

    /**
     * * Создать действие пользователя для ведения журнала активности операторов и админов 
     */
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
            await this.userModel.insertAction(trx, payload)
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