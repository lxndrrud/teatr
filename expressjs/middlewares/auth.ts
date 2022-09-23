import { Request, Response, NextFunction } from "express"
import { ErrorInterface } from "../interfaces/errors"
import { verify } from "jsonwebtoken"
import { UserRequestOption } from "../interfaces/users"
import { IUserInfrastructure } from "../infrastructure/User.infra"
import { IUserRepo } from "../repositories/User.repo"
import { IPermissionChecker } from "../infrastructure/PermissionChecker.infra"

export class AuthMiddleware {
    private userRepo
    private permissionChecker

    constructor(
        userRepoInstance: IUserRepo,
        permissionCheckerInstance: IPermissionChecker,
        userInfrastructureInstance: IUserInfrastructure
    ) {
        this.userRepo = userRepoInstance
        this.permissionChecker = permissionCheckerInstance
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
            const userData = <UserRequestOption> {...JSON.parse(JSON.stringify(decoded))}
            const user = await this.userRepo.getUser(userData.id)
            if (!user) {
                res.status(403).send({
                    message: "Неверные данные пользователя!"
                })
                return
            }
            if (!(await this.permissionChecker.check_HasAccessToAdmin(user))) {
                res.status(403).send({
                    message: "Доступ запрещен!"
                })
                return
            }
            req.user = userData
            next()
        } catch (error) {
            res.status(401).send(<ErrorInterface> {
                message: 'Неверный токен!'
            })
        }
    }
}
