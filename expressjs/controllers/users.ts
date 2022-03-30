import { Request, Response } from "express";
import { UserBaseInterface, UserLoginInterface, UserRegisterInterface, isUserLoginInterface, isUserRegisterInterface } 
    from "../interfaces/users";
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors";
import { UserFetchingInstance } from "../fetchingModels/users";

/**
 * * Контроллер регистрации пользователя
 */
export const registerUser = async (req: Request, res: Response) => {
    // * Парсинг тела запроса
    if (isUserRegisterInterface(req.body)) {
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
    if (typeof token ==='string') {
        res.status(200).send({
            token: token
        })
    }
    else if (token === 401 ) {
        res.status(401).send(<ErrorInterface>{
            message: 'Пользователь с такими входными данными не найден!'
        })
    }  
    else if (token === 500) {
        res.status(500).send(<ErrorInterface>{
            message: 'Внутренняя ошибка сервера!'
        })
    }
}

/**
 * * Получить всех пользователей с БД
 */
export const getAllUsers = async (req: Request, res: Response) => {
    const query = await UserFetchingInstance.getAll()
    if (query === 500) {
        res.status(500).send(<ErrorInterface>{
            message: 'Внутренняя ошибка сервера!'
        })
        return
    }
    res.status(200).send(query)
}