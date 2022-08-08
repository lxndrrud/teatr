import { Request, Response } from "express";
import { UserBaseInterface, UserLoginInterface, UserRegisterInterface, isUserLoginInterface, isUserRegisterInterface, IUserChangePassword, IUserPersonalInfo } 
    from "../interfaces/users";
import { ErrorInterface, InnerErrorInterface, isInnerErrorInterface } from "../interfaces/errors";
import { UserService } from "../services/users";

export class UserController {
    private userService

    constructor(userServiceInstance: UserService) {
        this.userService = userServiceInstance
    }

    /**
     * * Контроллер регистрации пользователя
     */
    async registerUser(req: Request, res: Response) {
        // * Парсинг тела запроса
        if (!isUserRegisterInterface(req.body)) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        let requestBody: UserRegisterInterface = {...req.body}

        const newUser = await this.userService.createUser(requestBody)

        if (isInnerErrorInterface(newUser)) {
            res.status(newUser.code).send(<ErrorInterface>{
                message: newUser.message
            })
            return 
        }

        res.status(201).send(newUser)
    }

    /**
     * * Контроллер логина пользователя
     */
    async loginUser(req: Request, res: Response) {
        // * Проверка тела запроса
        if (!isUserLoginInterface(req.body)) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        let requestBody: UserLoginInterface = {...req.body}
    
        const info = await this.userService.loginUser(requestBody)
    
        if (isInnerErrorInterface(info)) {
            res.status(info.code).send(<InnerErrorInterface>{
                message: info.message
            })
            return
        }

        if (info.isAdmin) {
            res.status(200).send(info)
        } else {
            res.status(200).send({
                token: info.token
            })
        }
    }

    /**
     * @deprecated
     * * Контроллер логина админа для администраторской части сайта
     */
    async loginAdmin(req: Request, res: Response) {
         // * Проверка тела запроса
         if (!isUserLoginInterface(req.body)) {
            res.status(400).send(<ErrorInterface>{
                message: 'Неверное тело запроса!'
            })
            return
        }
        let requestBody: UserLoginInterface = {...req.body}
    
        const token = await this.userService.loginAdmin(requestBody)
    
        if (isInnerErrorInterface(token)) {
            res.status(token.code).send(<InnerErrorInterface>{
                message: token.message
            })
            return
        }
    
        res.status(200).send({
            token: token
        })
    }

    /**
     * * Получить всех пользователей с БД
     */
    async getAllUsers(req: Request, res: Response) {
        const query = await this.userService.getAll()

        if (isInnerErrorInterface(query)) {
            res.status(query.code).send(<ErrorInterface>{
                message: query.message
            })
            return
        }
        
        res.status(200).send(query)
    }

    /**
     * * Получение информации о пользователе для личного кабинета
     */
    async getPersonalArea(req: Request, res: Response) {
        if (!req.user) {
            res.status(401).send(<ErrorInterface>{
                message: "Пользователь не распознан!"
            })
            return
        }
        const query = await this.userService.getPersonalArea(req.user)
        if (isInnerErrorInterface(query)) {
            res.status(query.code).send(<ErrorInterface>{
                message: query.message
            })
            return
        }
        res.status(200).send({
            "user": query
        })
    }

    /**
     * * Получение информации о пользователе (уровень "Оператор", "Администратор")
     */
    async getUser(req: Request, res: Response) {
        if (!req.user) {
            res.status(401).send(<ErrorInterface>{
                message: "Пользователь не распознан!"
            })
            return
        }
        const idUser = parseInt(req.params.idUser)
        if (!idUser) {
            res.status(400).send(<ErrorInterface> {
                message: "Идентификатор пользователя не найден!"
            })
            return
        }
        const query = await this.userService.getUser(req.user, idUser)
        if (isInnerErrorInterface(query)) {
            res.status(query.code).send(<ErrorInterface>{
                message: query.message
            })
            return
        }
        res.status(200).send({
            user: query
        })
    }

    /**
     * * Смена пароля
     */
    async changePassword(req: Request, res: Response) {
        if (!req.user) {
            res.status(401).send(<ErrorInterface>{
                message: "Вы не авторизованы!"
            })
            return 
        }
        
        let passwordInfo: IUserChangePassword
        try {
            passwordInfo = {...req.body}
        } catch(e) {
            res.status(400).send(<ErrorInterface> {
                message: "Тело запроса не распознано!"
            })
            return
        }
        if (!passwordInfo) {
            res.status(400).send(<ErrorInterface>{
                message: "Неверное тело запроса!"
            })
            return
        }

        const result = await this.userService.changePassword(req.user, passwordInfo)
        if (isInnerErrorInterface(result)) {
            res.status(result.code).send(<ErrorInterface>{
                message: result.message
            })
            return
        }

        res.status(200).end()
    }

    /**
     * * Изменение личной информации пользователя
     */
    async changePersonalInfo(req: Request, res: Response) {
        if (!req.user) {
            res.status(401).send(<ErrorInterface>{
                message: "Вы не авторизованы!"
            })
            return 
        }

        let personalInfo: IUserPersonalInfo
        try {
            personalInfo = {...req.body}
        } catch(e) {
            res.status(400).send(<ErrorInterface>{
                message: "Тело запроса не распознано!"
            })
            return
        }
        if (!personalInfo) {
            res.status(400).send(<ErrorInterface>{
                message: "Неверное тело запроса!"
            })
            return
        }

        const result = await this.userService.changePersonalInfo(req.user, personalInfo)
        if (isInnerErrorInterface(result)) {
            res.status(result.code).send(<ErrorInterface>{
                message: result.message
            })
            return
        }

        res.status(200).end()
    }

    /**
     * * Восстановление пароля по почте
     */
    async restorePasswordByEmail(req: Request, res: Response) {
        const email = req.body.email
        if (!email) {
            res.status(400).send(<ErrorInterface>{
                message: "Не указана почта для восстановления пароля!"
            })
            return
        } 
        const result = await this.userService.restorePasswordByEmail(email)
        if (isInnerErrorInterface(result)) {
            res.status(result.code).send(<ErrorInterface>{
                message: result.message
            })
            return
        }
        res.status(200).end()
    }

}