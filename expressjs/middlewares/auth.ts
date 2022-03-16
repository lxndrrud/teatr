import { Request, Response, NextFunction } from "express"
import { ErrorInterface } from "../interfaces/errors"
import { verify } from "jsonwebtoken"

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

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
}