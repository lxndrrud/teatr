import { Request, Response } from "express";
import { KnexConnection } from "../knex/connections";
import * as UserModel from "../models/users"
import * as RoleModel from "../models/roles"
import { UserBaseInterface, UserLoginInterface, UserRegisterInterface, isUserLoginInterface } 
    from "../interfaces/users";
import { ErrorInterface } from "../interfaces/errors";
import { compareSync } from "bcryptjs";

/**
 * * Контроллер регистрации пользователя
 */
export const registerUser = async (req: Request, res: Response) => {
    // * Парсинг тела запроса
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
    // * Проверка на существующего пользователя
    const existingUserCheck = await UserModel.getUserByEmail(requestBody.email)
    if (existingUserCheck) {
        const error: ErrorInterface = {
            message: 'Пользователь с такой почтой уже существует!'
        }
        res.status(409).send(error)
        return
    }
    // * Получаем роль "Посетитель" из базы данных
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
    // * Транзакция: создать пользователя, затем дать ему токен
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

/**
 * * Контроллер логина пользователя
 */
export const loginUser = async (req: Request, res: Response) => {
    // * Проверка тела запроса
    let requestBody: UserLoginInterface
    try {
        if (!isUserLoginInterface(req.body)) throw 'Неверное тело запроса!'
        requestBody = {...req.body}
    } catch (e: any) {
        const error: ErrorInterface = {
            message: e
        }
        res.status(400).send(error)
        return
    }
    // * Получение пользователя и сравнение введенного пароля с хэшем в базе
    const user = await UserModel.getUserByEmail(requestBody.email)
    if (!(user && compareSync(requestBody.password, user.password))) {
        const error: ErrorInterface = {
            message: 'Пользователь с такими входными данными не найден!'
        }
        res.status(401).send(error)
        return
    }
    // * Транзакция: сгенерировать токен для пользователя, сохранить в БД и отправить его 
    const trx = await KnexConnection.transaction()
    try {
        const fetchedUser = (await UserModel.generateToken(trx, user))[0]
        await trx.commit()
        res.status(200).send({
            token: fetchedUser.token
        })
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

/**
 * * Получить всех пользователей с БД
 */
export const getAllUsers = async (req: Request, res: Response) => {
    const query = await UserModel.getUsers()
    res.status(200).send(query)
}