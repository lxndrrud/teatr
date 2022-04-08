import { Request, Response } from "express";
import { UserBaseInterface, UserLoginInterface, UserRegisterInterface, isUserLoginInterface, isUserRegisterInterface } 
    from "../interfaces/users";
import { ErrorInterface, InnerErrorInterface, isInnerErrorInterface } from "../interfaces/errors";
import { UserFetchingInstance } from "../fetchingModels/users";

/**
 * * Контроллер регистрации пользователя
 */
export const registerUser = async (req: Request, res: Response) => {
    // * Парсинг тела запроса
    if (!isUserRegisterInterface(req.body)) {
        console.log(req.body, isUserRegisterInterface(req.body))
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    let requestBody: UserRegisterInterface = {...req.body}

    const newUser = await UserFetchingInstance.createUser(requestBody)

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
export const loginUser = async (req: Request, res: Response) => {
    // * Проверка тела запроса
    if (!isUserLoginInterface(req.body)) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверное тело запроса!'
        })
        return
    }
    let requestBody: UserLoginInterface = {...req.body}

    const token = await UserFetchingInstance.loginUser(requestBody)

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
export const getAllUsers = async (req: Request, res: Response) => {
    const query = await UserFetchingInstance.getAll()

    if (isInnerErrorInterface(query)) {
        res.status(query.code).send(<ErrorInterface>{
            message: query.message
        })
        return
    }
    
    res.status(200).send(query)
}