import { Knex } from "knex"
import { KnexConnection } from "../knex/connections"
import { UserBaseInterface, UserInterface, UserLoginInterface } from "../interfaces/users"
import { hash, compareSync } from 'bcryptjs';


export const getUser = (idUser: number) => {
    return KnexConnection<UserInterface>('users')
        .where({
            id: idUser
        })
        .first()
}

export const getUserByEmail = (email: string) => {
    return KnexConnection<UserInterface>('users')
        .where({
            email
        })
        .first()
}

export const createUser = (trx: Knex.Transaction, payload: UserBaseInterface) => {
    return trx<UserInterface>('users')
        .insert(payload)
        .returning('*')
}

export const loginUser = async (payload: UserLoginInterface): Promise<string | null> => {
    const user = await getUserByEmail(payload.email)
    if (user && compareSync(user.password, payload.password)) {
        return user.token
    }
    return null
}