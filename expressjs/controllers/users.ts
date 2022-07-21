import { Request, Response } from "express";
import { UserBaseInterface, UserLoginInterface, UserRegisterInterface, isUserLoginInterface, isUserRegisterInterface } 
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
    
        const token = await this.userService.loginUser(requestBody)
    
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

}