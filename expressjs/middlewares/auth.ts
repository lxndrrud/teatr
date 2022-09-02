import { Request, Response, NextFunction } from "express"
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors"
import { verify } from "jsonwebtoken"
import { UserRequestOption } from "../interfaces/users"
import { IUserInfrastructure } from "../infrastructure/User.infra"

export class AuthMiddleware {
    private userInfrastructure

    constructor(
        userInfrastructureInstance: IUserInfrastructure
    ) {
        this.userInfrastructure = userInfrastructureInstance 
    }

    public basicAuthMiddleware(req: Request, res: Response, next: NextFunction) {
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

    public async staffAuthMiddleware(req: Request, res: Response, next: NextFunction) {
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
            const userData = {...JSON.parse(JSON.stringify(decoded))}
            let check = await this.userInfrastructure.checkIsUserStaff(<UserRequestOption>userData)
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

    public async adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
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
            const userData = {...JSON.parse(JSON.stringify(decoded))}
            let check = await this.userInfrastructure.checkIsUserAdmin(<UserRequestOption>userData)
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
}
