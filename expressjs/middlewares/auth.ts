import { Request, Response, NextFunction } from "express"
import { ErrorInterface } from "../interfaces/errors"
import { KnexConnection } from "../knex/connections"


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.token
    if (!token) {
        const error: ErrorInterface = {
            message: 'Вы не авторизованы!'
        }
        res.status(403).send(error)
    }
    else {
        if (checkToken()) next()
    }
}

const checkToken = (): boolean => {
    return true
}