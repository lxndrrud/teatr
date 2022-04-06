// * Библиотеки
import { KnexConnection } from "../knex/connections"
import { Request, Response } from "express"
// * Интерфейсы
import { SlotInterface, ReservationsSlotsBaseInterface } from "../interfaces/slots"
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors"
import { ReservationBaseInterface, ReservationInterface, 
    ReservationCreateInterface, ReservationDatabaseInterface, ReservationConfirmationInterface, isReservationCreateInterface, isReservationConfirmationInterface, ReservationWithoutSlotsInterface, ReservationBaseWithoutConfirmationInterface, isReservationFilterQueryInterface, ReservationFilterQueryInterface} from "../interfaces/reservations"
// * Модели
import { ReservationFetchingInstance } from "../fetchingModels/reservations"
// * Утилиты
import { generateCode } from "../utils/code"
import { sendMail } from "../utils/email"
import { RoleDatabaseInterface } from "../interfaces/roles"

/**
 * * Получение записи брони (уровень 'Посетитель')
 */
export const getSingleReservation = async (req: Request, res: Response) => {
    // Проверка авторизации
    if (!req.user) {
        res.status(401).end()
        return
    }

    // Проверка строки запроса
    const idReservation = parseInt(req.params.idReservation)
    if (!idReservation) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверный запрос!'
        })
        return
    }

    const query = await ReservationFetchingInstance
        .getSingleFullInfo(req.user.id, req.user.id_role, idReservation)

    if (isInnerErrorInterface(query)) {
        res.status(query.code).send(<ErrorInterface>{
            message: query.message
        })
        return
    }

    res.status(200).send(query)
}

/**
 * * Создание брони (уровень 'Посетитель', 'Кассир', 'Администратор') 
 */
export const postReservation = async (req: Request, res: Response) => {
    // Проверка авторизации
    if (!req.user) {
        res.status(401).end()
        return
    }

    //  Проверка тела запроса на соответствие интерфейсу
    let requestBody: ReservationCreateInterface
    if (!isReservationCreateInterface(req.body)) {
        const error: ErrorInterface = {
            message: 'Неверный синтаксис запроса!'
        }
        res.status(400).send(error)
        return
    }
    requestBody = { ...req.body }

    const response = await ReservationFetchingInstance.createReservation(req.user, requestBody)

    if (isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }

    res.status(201).send(response)
}

/**
 * * Подтверждение брони (уровень 'Посетитель')
 */
export const confirmReservation = async (req: Request, res: Response) => {
    // Проверка на авторизованность
    if (!req.user) {
        res.status(401).send(<ErrorInterface>{
            message: 'Ошибка авторизации!'
        })
        return
    }

    // Проверка строки запроса
    const idReservation = parseInt(req.params.idReservation)
    if (!idReservation) {
        res.status(400).send(<ErrorInterface>{
            message: 'Ошибка в строке запроса!'
        })
        return
    }

    // Проверка тела запроса
    let requestBody: ReservationConfirmationInterface
    if (!isReservationConfirmationInterface(req.body)) {
        res.status(400).send(<ErrorInterface>{
            message: 'Ошибка в теле запроса!'
        })
        return
    }
    requestBody = {...req.body}

    const response = await ReservationFetchingInstance
        .confirmReservation(req.user, idReservation, requestBody)

    if (isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }

    res.status(200).end()
}

export const paymentForReservation = async (req: Request, res: Response) => {
    // Проверка на авторизованность
    if (!req.user) {
        res.status(401).send(<ErrorInterface>{
            message: 'Ошибка авторизации!'
        })
        return
    }

    // Проверка наличия статуса оплаты в теле запроса
    if (req.body.status === undefined) {
        res.status(400).send(<ErrorInterface>{
            message: 'Нет статуса оплаты в теле запроса!'
        })
        return
    }

    // Проверка строки запроса
    const idReservation = parseInt(req.params.idReservation)
    if (!idReservation) {
        res.status(400).send(<ErrorInterface>{
            message: 'Ошибка в строке запроса!'
        })
        return
    }

    const response = await ReservationFetchingInstance
        .paymentForReservation(req.user, idReservation, req.body.status)

    if (isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }

    res.status(200).end()
}

/**
 * * Удаление брони (уровень 'Посетитель', 'Кассир', 'Администратор')
 */
export const deleteReservation = async (req: Request, res: Response) => {
    // Проверка на авторизованность
    if (!req.user) {
        res.status(401).end()
        return
    }

    // Проверка строки запроса
    const idReservation = parseInt(req.params.idReservation)
    if (!idReservation) {
        res.status(400).end()
        return
    }

    const response = await ReservationFetchingInstance.deleteReservation(req.user, idReservation)

    if (isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }

    res.status(200).end()
}

/**
 * * Получение броней (уровень "Посетитель", "Кассир", "Администратор")
 */
export const getReservations = async (req: Request, res: Response) => {
    // Проверка на авторизованность
    if (!req.user) {
        res.status(401).send(<ErrorInterface>{
            message: 'Ошибка авторизации!'
        })
        return
    }

    const response = await ReservationFetchingInstance.getReservations(req.user)

    if(isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }

    res.status(200).send(response)
}

/**
 * * Получение опций для фильтра броней (уровень 'Кассир', 'Администратор')
 */
export const getReservationFilterOptions = async (req: Request, res: Response) => {
    // Проверка на авторизованность
    if (!req.user) {
        res.status(401).send(<ErrorInterface>{
            message: 'Ошибка авторизации!'
        })
        return
    }

    const response = await ReservationFetchingInstance.getReservationFilterOptions(req.user)

    if (isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }

    res.status(200).send(response)
}

/**
 * * Получение броней по фильтру
 */
export const getFilteredReservations = async (req: Request, res: Response) => {
    // Проверка на авторизованность
    if (!req.user) {
        res.status(401).send(<ErrorInterface>{
            message: 'Ошибка авторизации!'
        })
        return
    }

    // Проверка строки запроса
    if (!isReservationFilterQueryInterface(req.query)) {
        res.status(400).send(<ErrorInterface>{
            message: 'Неверная строка запроса!'
        })
        return
    }
    const userQuery: ReservationFilterQueryInterface = {...req.query}

    const response = await ReservationFetchingInstance.getFilteredReservations(userQuery, req.user)

    if (isInnerErrorInterface(response)) {
        res.status(response.code).send(<ErrorInterface>{
            message: response.message
        })
        return
    }

    res.status(200).send(response)
}
