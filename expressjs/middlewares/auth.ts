import { Request, Response, NextFunction } from "express"
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors"
import { verify } from "jsonwebtoken"
import { UserDatabaseModel } from "../dbModels/users"
import { UserRequestOption } from "../interfaces/users"
import { UserInfrastructure } from "../infrastructure/User.infra"
import { KnexConnection } from "../knex/connections"

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['auth-token']
    if (!token) {
        const error: ErrorInterface = {
            message: 'Вы не авторизованы!'
        }
        res.status(403).send(error)
        return
    }
    try {
        const decoded = verify(`${token}`, `${process.env.SECRET_KEY}`);
        req.user = {...JSON.parse(JSON.stringify(decoded))}
        next()
    } catch (e) {
        const error: ErrorInterface = {
            message: 'Неверный токен!'
        }
        res.status(401).send(error)
        return
    }
}

export const staffAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['auth-token']
    if (!token) {
        const error: ErrorInterface = {
            message: 'Вы не авторизованы!'
        }
        res.status(403).send(error)
        return
    }
    try {
        const decoded = verify(`${token}`, `${process.env.SECRET_KEY}`);
        const userInfrastructure = new UserInfrastructure(new UserDatabaseModel(KnexConnection))
        const userData = {...JSON.parse(JSON.stringify(decoded))}
        let check = await userInfrastructure.checkIsUserStaff(<UserRequestOption>userData)
        if (isInnerErrorInterface(check)) {
            res.status(check.code).send({
                message: check.message
            })
            return
        }
        if (!check) {
            res.status(403).send({
                message: "Неверные данные пользователя!"
            })
            return
        }
        req.user = userData
        next()
    } catch (e) {
        const error: ErrorInterface = {
            message: 'Неверный токен!'
        }
        res.status(401).send(error)
        return
    }
}