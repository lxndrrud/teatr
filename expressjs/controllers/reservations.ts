// * Библиотеки
import { Request, Response } from "express"
// * Интерфейсы
import { ErrorInterface } from "../interfaces/errors"
import { 
    ReservationCreateInterface, ReservationConfirmationInterface, isReservationCreateInterface, isReservationConfirmationInterface,
    isReservationFilterQueryInterface, ReservationFilterQueryInterface} from "../interfaces/reservations"
// * Утилиты
import { IReservationFilterService} from "../services/reservations/ReservationFilter.service"
import { IReservationCRUDService } from "../services/reservations/ReservationCRUD.service"
import { IReservationPaymentService } from "../services/reservations/ReservationPayment.service"
import { ISlotsEventEmitter } from "../events/SlotsEmitter"
import { IErrorHandler } from "../utils/ErrorHandler"

export class ReservationController {
    private reservationPaymentService
    private reservationCRUDService
    private reservationFilterService
    private slotsEventEmitter
    private errorHandler
    constructor(
        reservationPaymentServiceInstance: IReservationPaymentService, 
        reservationCRUDServiceInstance: IReservationCRUDService,
        reservationFilterServiceInstance: IReservationFilterService,
        slotsEventEmitterInstance: ISlotsEventEmitter,
        errorHandlerInstance: IErrorHandler
    ) {
        this.reservationPaymentService = reservationPaymentServiceInstance
        this.reservationCRUDService = reservationCRUDServiceInstance
        this.reservationFilterService = reservationFilterServiceInstance
        this.slotsEventEmitter = slotsEventEmitterInstance
        this.errorHandler = errorHandlerInstance
    }

    /**
     * * Получение записи брони (уровень 'Посетитель')
     */
    async getSingleReservation(req: Request, res: Response){
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
        try {
            const query = await this.reservationCRUDService
                .getSingleFullInfo(req.user.id, req.user.id_role, idReservation)
            res.status(200).send(query)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    /**
     * * Создание брони (уровень 'Посетитель', 'Кассир', 'Администратор') 
     */
    async postReservation(req: Request, res: Response) {
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
        try {
            const response = await this.reservationCRUDService.createReservation(req.user, requestBody)
            this.slotsEventEmitter.emitSession(requestBody.id_session)
            res.status(201).send(response)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    /**
     * * Подтверждение брони (уровень 'Посетитель')
     */
    async confirmReservation(req: Request, res: Response) {
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
        try {
            await this.reservationPaymentService.confirmReservation(req.user, idReservation, requestBody)
            res.status(200).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    /**
     * * Повторная отправка письма с кодом подвтерждения на почту
     * TODO: Доделать этот контроллер
     */
    async resendConfirmationEmail(req: Request, res: Response) {
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

    }

    /**
     * * Изменение статуса оплаты
     */
    async paymentForReservation(req: Request, res: Response) {
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
        try {
            await this.reservationPaymentService.paymentForReservation(req.user, idReservation)
            res.status(200).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    /**
     * * Удаление брони (уровень 'Посетитель', 'Кассир', 'Администратор')
     */
    async deleteReservation(req: Request, res: Response) {
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
        try {
            const idSession = await this.reservationCRUDService.deleteReservation(req.user, idReservation)
            this.slotsEventEmitter.emitSession(idSession)
            res.status(200).end()
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    /**
     * * Получение броней (уровень "Посетитель", "Кассир", "Администратор")
     */
    async getReservations(req: Request, res: Response) {
        // Проверка на авторизованность
        if (!req.user) {
            res.status(401).send(<ErrorInterface>{
                message: 'Ошибка авторизации!'
            })
            return
        }
        try {
            const response = await this.reservationCRUDService.getReservations(req.user)
            res.status(200).send(response)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    /**
     * * Получение опций для фильтра броней (уровень 'Кассир', 'Администратор')
     */
    async getReservationFilterOptions(req: Request, res: Response) {
        // Проверка на авторизованность
        if (!req.user) {
            res.status(401).send(<ErrorInterface>{
                message: 'Ошибка авторизации!'
            })
            return
        }
        try {
            const response = await this.reservationFilterService.getReservationFilterOptions(req.user)
            res.status(200).send(response)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }

    /**
     * * Получение броней по фильтру
     */
    async getFilteredReservations(req: Request, res: Response) {
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
        try {
            const response = await this.reservationFilterService.getFilteredReservations(userQuery, req.user)
            res.status(200).send(response)
        } catch (error) {
            this.errorHandler.fetchError(res, error)
        }
    }
}
