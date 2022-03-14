import { Request, Response } from "express";
import { KnexConnection } from "../knex/connections";
import * as UserModel from "../models/users"
import { UserBaseInterface, UserLoginInterface } from "../interfaces/users";
import { ErrorInterface } from "../interfaces/errors";

export const registerUser = async (req: Request, res: Response) => {
    let requestBody: UserBaseInterface
    try {
        requestBody = {...req.body}
    } catch (e) { 
        const error: ErrorInterface = {
            message: 'Неверное тело запроса!'
        }
        res.status(400).send(error)
        return
    }
    const trx = await KnexConnection.transaction()
    try {
        const user = (await UserModel.createUser(trx, requestBody))[0]
        res.status(201).send(user)
    } catch (e) {
        const error: ErrorInterface = {
            message: 'Внутренняя ошибка сервера!'
        }
        res.status(500).send(error)
        return
    }
}

export const login = async (req: Request, res: Response) => {
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
    const token = await UserModel.loginUser(requestBody)
    if (token) {
        res.status(200).send({
            token
        })
    }
    else {
        const error: ErrorInterface = {
            message: 'Пользователь с такими входными данными не найден!'
        }
        res.status(401).send(error)
    }
}