import { Request, Response } from "express";
import { UserLoginInterface, UserRegisterInterface, isUserLoginInterface, isUserRegisterInterface, 
    IUserChangePassword, IUserPersonalInfo, UserInterface, isIUserPersonalInfo, isIUserChangePassword} 
    from "../interfaces/users";
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors";
import { IUserCRUDService } from "../services/users/UsersCRUD.service";
import { IUserCSVService } from "../services/users/UsersCSV.service";
import { UploadedFile } from "express-fileupload";
import { User } from "../entities/users";
import { IErrorHandler } from "../utils/ErrorHandler";

export class UserController {
    private userCRUDService
    private userCSVService
    private errorHandler

    constructor(
        userCRUDServiceInstance: IUserCRUDService,
        userCSVServiceInstance: IUserCSVService,
        errorHandlerInstance: IErrorHandler
    ) {
        this.userCRUDService = userCRUDServiceInstance
        this.userCSVService = userCSVServiceInstance
        this.errorHandler = errorHandlerInstance
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

        let newUser: User
        try {
            newUser = await this.userCRUDService.createUser(requestBody)
        } catch(error) {
            return this.errorHandler.fetchError(res, error)
        }

        res.status(201).send(<UserInterface> {
            id: newUser.id,
            id_role: newUser.idRole,
            firstname: newUser.firstname,
            middlename: newUser.middlename,
            lastname: newUser.lastname,
            token: newUser.token,
            email: newUser.email,
            password: ''
        })
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
    
        let info: { token: string, isAdmin: boolean }
        try {
            info = await this.userCRUDService.loginUser(requestBody)
        } catch (error) {
            return this.errorHandler.fetchError(res, error)
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
     * * Получить всех пользователей с БД
     * @unused
     */
    async getAllUsers(req: Request, res: Response) {
        const query = await this.userCRUDService.getAll()

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

        let query: {
            email: string;
            firstname: string;
            middlename: string;
            lastname: string;
        }
        try {
            query = await this.userCRUDService.getPersonalArea(req.user)
        } catch (error) {
            return this.errorHandler.fetchError(res, error)
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
        let query: {
            id: number;
            id_role: number;
            role_title: string;
            email: string;
            firstname: string;
            middlename: string;
            lastname: string;
        }
        try {
            query = await this.userCRUDService.getUser(req.user, idUser)
        } catch (error) {
            return this.errorHandler.fetchError(res, error)
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
        if (!isIUserChangePassword(req.body)) {
            res.status(400).send(<ErrorInterface> {
                message: "Тело запроса не распознано!"
            })
            return
        }
        let passwordInfo: IUserChangePassword ={...req.body}
        try {
            await this.userCRUDService.changePassword(req.user, passwordInfo)
        } catch (error) {
            return this.errorHandler.fetchError(res, error)
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
        if (!isIUserPersonalInfo(req.body)) {
            res.status(400).send(<ErrorInterface>{
                message: "Тело запроса не распознано!"
            })
            return
        }
        let personalInfo: IUserPersonalInfo = {...req.body}
        if (!personalInfo) {
            res.status(400).send(<ErrorInterface>{
                message: "Неверное тело запроса!"
            })
            return
        }
        try {
            await this.userCRUDService.changePersonalInfo(req.user, personalInfo)
        } catch (error) {
            return this.errorHandler.fetchError(res, error)
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
        try {
            await this.userCRUDService.restorePasswordByEmail(email)
        } catch (error) {
            return this.errorHandler.fetchError(res, error)
        }
        res.status(200).end()
    }

    /**
     * * Повторно отправить письмо для восстановления на почту
     */
    async resendRestorationEmail(req: Request, res: Response) {
        const email = req.body.email
        if (!email) {
            res.status(400).send(<ErrorInterface>{
                message: "Не указана почта для восстановления пароля!"
            })
            return
        }
        try {
            await this.userCRUDService.resendRestorationEmail(email)
        } catch (error) {
            return this.errorHandler.fetchError(res, error)
        }
        res.status(200).end()
    }

    /**
     * * Загрузка пользователей через CSV
     */
    async createUsersCSV(req: Request, res: Response) {
        if (!req.user) {
            res.status(401).send({
                message: 'Вы не авторизованы'
            })
            return
        }
        if (!req.files) {
            res.status(400).send(<ErrorInterface>{
                message: "Запрос без прикрепленного csv-файла!"
            })
            return
        }
        let errors: string[]
        try {
            errors = await this.userCSVService
                .createUsersCSV(req.user, <UploadedFile> req.files.csv)
        } catch (error) {
            return this.errorHandler.fetchError(res, error)
        }
        res.status(200).send({
            success: "Пользователи успешно загружены!",
            errors
        })
    }

}