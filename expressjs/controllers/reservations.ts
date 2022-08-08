// * Библиотеки
import { Request, Response } from "express"
// * Интерфейсы
import { ErrorInterface, isInnerErrorInterface } from "../interfaces/errors"
import { ReservationBaseInterface, ReservationInterface, 
    ReservationCreateInterface, ReservationDatabaseInterface, ReservationConfirmationInterface, isReservationCreateInterface, isReservationConfirmationInterface, ReservationWithoutSlotsInterface, ReservationBaseWithoutConfirmationInterface, isReservationFilterQueryInterface, ReservationFilterQueryInterface} from "../interfaces/reservations"
// * Утилиты
import { IReservationFilterService} from "../services/reservations/ReservationFilter.service"
import { IReservationCRUDService } from "../services/reservations/ReservationCRUD.service"
import { IReservationPaymentService } from "../services/reservations/ReservationPayment.service"
import { ISlotsEventEmitter } from "../events/SlotsEmitter"

export class ReservationController {
    private reservationPaymentService
    private reservationCRUDService
    private reservationFilterService
    private slotsEventEmitter
    constructor(
        reservationPaymentServiceInstance: IReservationPaymentService, 
        reservationCRUDServiceInstance: IReservationCRUDService,
        reservationFilterServiceInstance: IReservationFilterService,
        slotsEventEmitterInstance: ISlotsEventEmitter
    ) {
        this.reservationPaymentService = reservationPaymentServiceInstance
        this.reservationCRUDService = reservationCRUDServiceInstance
        this.reservationFilterService = reservationFilterServiceInstance
        this.slotsEventEmitter = slotsEventEmitterInstance
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

        const query = await this.reservationCRUDService
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

        const response = await this.reservationCRUDService.createReservation(req.user, requestBody)

        if (isInnerErrorInterface(response)) {
            res.status(response.code).send(<ErrorInterface>{
                message: response.message
            })
            return
        }

        this.slotsEventEmitter.emitSession(requestBody.id_session)

        res.status(201).send(response)
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

        const response = await this.reservationPaymentService
            .confirmReservation(req.user, idReservation, requestBody)

        if (isInnerErrorInterface(response)) {
            res.status(response.code).send(<ErrorInterface>{
                message: response.message
            })
            return
        }

        res.status(200).end()
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

        const response = await this.reservationPaymentService
            .paymentForReservation(req.user, idReservation)

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

        const idSession = await this.reservationCRUDService.deleteReservation(req.user, idReservation)

        if (isInnerErrorInterface(idSession)) {
            res.status(idSession.code).send(<ErrorInterface>{
                message: idSession.message
            })
            return
        }

        this.slotsEventEmitter.emitSession(idSession)

        res.status(200).end()
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

        const response = await this.reservationCRUDService.getReservations(req.user)

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
    async getReservationFilterOptions(req: Request, res: Response) {
        // Проверка на авторизованность
        if (!req.user) {
            res.status(401).send(<ErrorInterface>{
                message: 'Ошибка авторизации!'
            })
            return
        }

        const response = await this.reservationFilterService.getReservationFilterOptions(req.user)

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

        const response = await this.reservationFilterService.getFilteredReservations(userQuery, req.user)

        if (isInnerErrorInterface(response)) {
            res.status(response.code).send(<ErrorInterface>{
                message: response.message
            })
            return
        }

        res.status(200).send(response)
    }
}
