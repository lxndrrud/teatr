import { Request, Response } from "express";
import { KnexConnection } from "../knex/connections";
import * as UserModel from "../models/users"
import * as RoleModel from "../models/roles"
import { UserBaseInterface, UserLoginInterface, UserRegisterInterface } 
    from "../interfaces/users";
import { ErrorInterface } from "../interfaces/errors";
import { hash, compareSync } from "bcryptjs";

export const registerUser = async (req: Request, res: Response) => {
    // * Parse request body
    let requestBody: UserRegisterInterface
    try {
        requestBody = {...req.body}
    } catch (e) { 
        const error: ErrorInterface = {
            message: 'Неверное тело запроса!'
        }
        res.status(400).send(error)
        return
    }
    // * Existing user check
    const existingUserCheck = await UserModel.getUserByEmail(requestBody.email)
    if (existingUserCheck) {
        const error: ErrorInterface = {
            message: 'Пользователь с такой почтой уже существует!'
        }
        res.status(409).send(error)
        return
    }
    // * Get visitor role from database
    const visitorRole = await RoleModel.getVisitorRole()
    if (!visitorRole) {
        console.log('register user -> Не найдена роль посетителя!')
        const error: ErrorInterface = {
            message: 'Внутренняя ошибка сервера!'
        }
        res.status(500).send(error)
        return
    }
    const fetchedRequestBody: UserBaseInterface = {...requestBody, id_role: visitorRole.id}
    // * Transaction: create user, then give him a token
    const trx = await KnexConnection.transaction()
    try {
        let user = (await UserModel.createUser(trx, fetchedRequestBody))[0]
        user = (await UserModel.generateToken(trx, user))[0]
        await trx.commit()
        res.status(201).send(user)
    } catch (e) {
        await trx.rollback()
        console.log(e)
        const error: ErrorInterface = {
            message: 'Внутренняя ошибка сервера!'
        }
        res.status(500).send(error)
        return
    }
}

export const loginUser = async (req: Request, res: Response) => {
    let requestBody: UserLoginInterface
    try {
        requestBody = {...req.body}
    } catch (e) {
        const error: ErrorInterface = {
            message: 'Неверное тело запроса!'
        }
        res.status(400).send(error)
        return
    }
    const user = await UserModel.getUserByEmail(requestBody.email)
    if (!(user && compareSync(requestBody.password, user.password))) {
        const myHash = await hash(requestBody.password, 10)
        console.log(user, myHash)
        const error: ErrorInterface = {
            message: 'Пользователь с такими входными данными не найден!'
        }
        res.status(401).send(error)
        return
    }
    const trx = await KnexConnection.transaction()
    try {
        const fetchedUser = (await UserModel.generateToken(trx, user))[0]
        await trx.commit()
        res.status(200).send(fetchedUser)
    } catch (e) {
        await trx.rollback()
        console.log(e)
        const error: ErrorInterface = {
            message: 'Внутренняя ошибка сервера!'
        }
        res.status(500).send(error)
        return
    }  
}

export const getAllUsers = async (req: Request, res: Response) => {
    const query = await UserModel.getUsers()
    res.status(200).send(query)
}