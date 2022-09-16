import { Knex } from "knex"
import { ReservationModel } from "../../dbModels/reservations"
import { Reservation } from "../../entities/reservations"
import { User } from "../../entities/users"
import { IReservationGuard } from "../../guards/Reservation.guard"
import { IPermissionChecker } from "../../infrastructure/PermissionChecker.infra"
import { IReservationInfrastructure } from "../../infrastructure/Reservation.infra"
import { InnerErrorInterface, isInnerErrorInterface } from "../../interfaces/errors"
import { ReservationConfirmationInterface, ReservationWithoutSlotsInterface } from "../../interfaces/reservations"
import { UserRequestOption } from "../../interfaces/users"
import { IReservationRepo } from "../../repositories/Reservation.repo"
import { IUserRepo } from "../../repositories/User.repo"
import { IEmailSender } from "../../utils/email"


export interface IReservationPaymentService {
    confirmReservation(
        user: UserRequestOption, 
        idReservation: number, 
        requestBody: ReservationConfirmationInterface): 
    Promise<InnerErrorInterface | undefined>

    paymentForReservation(user: UserRequestOption, idReservation: number): 
    Promise<InnerErrorInterface | undefined>
}

export class ReservationPaymentService {
    protected reservationGuard
    protected userRepo
    protected permissionChecker
    protected reservationRepo
    protected reservationInfrastructure
    protected emailSender

    constructor(
        reservationGuardInstance: IReservationGuard,
        userRepoInstance: IUserRepo,
        permissionCheckerInstance: IPermissionChecker,
        reservationRepoInstance: IReservationRepo,
        reservationInfraInstance: IReservationInfrastructure,
        emailSenderInstance: IEmailSender
    ) {
        this.reservationGuard = reservationGuardInstance
        this.userRepo = userRepoInstance
        this.permissionChecker = permissionCheckerInstance
        this.reservationRepo = reservationRepoInstance
        this.reservationInfrastructure = reservationInfraInstance
        this.emailSender = emailSenderInstance
    }

    /**
     * * Подтверждение брони
     */
    async confirmReservation(user: UserRequestOption, idReservation: number, 
        requestBody: ReservationConfirmationInterface) {
        // Получение роли из БД
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUser(user.id)
            .catch(e => { throw e })
            
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!userDB) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Пользователь не найден!'
            }
        }
        // Проверка на наличие записи в базе данных 
        let reservation: Reservation | null
        try {
            reservation = await this.reservationRepo.getReservation(idReservation)
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера с подключением!'
            }
        }
        if (!reservation) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Запись не найдена!'
            }
        }
        // Проверка на доступность подтверждения
        const canUserConfirm = this.reservationGuard.canUserConfirm(userDB, reservation)
        if (!canUserConfirm) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Пользователю данная операция не доступна!' 
            }
        }
        // Проверка на валидность кода подтверждения
        if (reservation.confirmationCode !== requestBody.confirmation_code) {
            return <InnerErrorInterface>{
                code: 409,
                message: 'Неправильный код подтверждения!'
            }
        }
        // Создание записи действия для оператора
        if (await this.permissionChecker.check_CanSeeAllReservations(userDB)) {
            const actionDescription = `Подтверждение брони Res:${reservation.id}`
            try {
                await this.userRepo.createUserAction(userDB, actionDescription)
                .catch(e => { throw e }) 
            } catch(e) {
                console.error(e)
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера!'
                }
            }
            
        }
        // Изменение флага подтверждения
        try {
            await this.reservationRepo.confirmReservation(idReservation)
            .catch(e => { throw e })
        } catch (e) { 
            console.error(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Ошибка в изменении записи!'
            }
        }
    }

    /**
     * * Повторная отправка письма на почту с кодом подтверждения брони
     */
    async resendConfirmationEmail(user: UserRequestOption, idReservation: number) {
        // Получение роли из БД
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUser(user.id)
            .catch(e => { throw e })
            
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!userDB) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Пользователь не найден!'
            }
        }
        // Проверка на наличие записи в базе данных 
        let reservation: Reservation | null
        try {
            reservation = await this.reservationRepo.getReservation(idReservation)
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера с подключением!'
            }
        }
        if (!reservation) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Запись не найдена!'
            }
        }
        // Проверка совпадает ли id владельца с id пользователя, который запрашивает подтверждение
        if (user.id !== reservation.user.id) 
            return <InnerErrorInterface> {
                code: 403,
                message: 'Вы не можете запросить повторную отправку письма с подтверждением для этой брони!'
            }
        // Отправка письма на почту с информацией о сеансе и кодом подтверждения
        let check_CanReserveWithoutConfirmation: boolean
        try {
            check_CanReserveWithoutConfirmation = await this.permissionChecker.check_CanReserveWithoutConfirmation(userDB)
        } catch(e) {
            console.error(e)
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера'
            }
        }
        if (check_CanReserveWithoutConfirmation)
            return <InnerErrorInterface> {
                code: 500,
                message: 'Вы можете бронировать без подтверждения. Пожалуйста, обратитесь за помощью в службу поддержки.'
            }
        // Проверка данных для подтверждения (флаг подвтержденности и тайм-аут брони)
        if (!(this.reservationGuard.canResendConfirmationEmail(userDB, reservation))) {
            return <InnerErrorInterface> {
                code: 403, 
                message: 'Вы не можете запросить повторную отправку письма с подвтерждением, пока не истёк тайм-аут.'
            }
        }
        // Сгенерировать письмо и отправить
        const emailInfo = this.reservationInfrastructure.generateConfirmationMailMessage({
            id_reservation: reservation.id, 
            confirmation_code: reservation.confirmationCode,
            play_title: reservation.session.play.title, 
            timestamp: reservation.session.timestamp,
            auditorium_title: reservation.reservationSlots[0].slot.seat.row.auditorium.title
        })
        this.emailSender.send(
            user.email, 
            emailInfo.subject, 
            emailInfo.message)
        .catch((e) => console.error(e))
    }

    /**
     * * Изменение статуса оплаты (из false в true)
     */
    async paymentForReservation(user: UserRequestOption, idReservation: number) {
        // Получение роли из БД
        let userDB: User | null
        try {
            userDB = await this.userRepo.getUser(user.id)
            .catch(e => { throw e })
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера!'
            }
        }
        if (!userDB) {
            return <InnerErrorInterface> {
                code: 403,
                message: 'Пользователь не найден!'
            }
        }
        // Проверка на наличие записи в базе данных 
        let reservation: Reservation | null
        try {
            reservation = await this.reservationRepo.getReservation(idReservation)
        } catch(e) {
            return <InnerErrorInterface> {
                code: 500,
                message: 'Внутренняя ошибка сервера с подключением!'
            }
        }
        if (!reservation) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Запись не найдена!'
            }
        }
        // Проверка прав
        const canUserPay = await this.reservationGuard.canUserPay(userDB, reservation)
        if (!canUserPay) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'У пользователя недостаточно прав для совершения этой операции!'
            }
        }
        // Создание записи действия для оператора
        if (await this.permissionChecker.check_CanSeeAllReservations(userDB)) {
            const actionDescription = `Изменение флага оплаты на ${!reservation.isPaid}`
            try {
                await this.userRepo.createUserAction(userDB, actionDescription)
                .catch(e => { throw e }) 
            } catch(e) {
                console.error(e)
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера!'
                }
            }
            
        }
        // Изменение флага оплаты и подвтерждения
        try {
            await this.reservationRepo.paymentForReservation(idReservation)
            .catch(e => { throw e })
        } catch (e) { 
            console.error(e)
            return <InnerErrorInterface>{
                code: 500,
                message: 'Ошибка в изменении записи!'
            }
        }
    }
}