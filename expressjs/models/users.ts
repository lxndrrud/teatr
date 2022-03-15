import { Knex } from "knex"
import { KnexConnection } from "../knex/connections"
import { UserBaseInterface, UserInterface, UserRequestOption } from "../interfaces/users"
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken'

export const getUsers = () => {
    return KnexConnection<UserInterface>('users')
}

export const getUser = (idUser: number) => {
    return getUsers()
        .where({
            id: idUser
        })
        .first()
}

export const getUserByEmail = (email: string) => {
    return getUsers()
        .where({
            email
        })
        .first()
}

export const createUser = async (trx: Knex.Transaction, payload: UserBaseInterface) => {
    payload.password = await hash(payload.password, 10)
    return trx<UserInterface>('users')
        .insert(payload)
        .returning('*')
}

export const generateToken = (trx: Knex.Transaction, user: UserInterface) => {
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
    return trx<UserInterface>('users')
        .where({
            id: user.id
        })
        .update({
            token
        })
        .returning('*')
}