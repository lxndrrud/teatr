import { IReservationGuard } from "../../guards/Reservation.guard"
import { IPermissionChecker } from "../../infrastructure/PermissionChecker.infra"
import { IReservationInfrastructure } from "../../infrastructure/Reservation.infra"
import { InnerError, InnerErrorInterface } from "../../interfaces/errors"
import { ReservationConfirmationInterface, ReservationWithoutSlotsInterface } from "../../interfaces/reservations"
import { UserRequestOption } from "../../interfaces/users"
import { IReservationRepo } from "../../repositories/Reservation.repo"
import { IUserRepo } from "../../repositories/User.repo"
import { IEmailSender } from "../../utils/email"


export interface IReservationPaymentService {
    confirmReservation(user: UserRequestOption, idReservation: number, requestBody: ReservationConfirmationInterface): Promise<void>

    resendConfirmationEmail(user: UserRequestOption, idReservation: number): Promise<void>

    paymentForReservation(user: UserRequestOption, idReservation: number): Promise<void>
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
        const userDB = await this.userRepo.getUser(user.id)
        if (!userDB) throw new InnerError('Пользователь не распознан.', 403) 
        // Проверка на наличие записи в базе данных 
        const reservation = await this.reservationRepo.getReservation(idReservation)
        if (!reservation) throw new InnerError('Бронь не найдена.', 404)
        // Проверка на доступность подтверждения
        const canUserConfirm = this.reservationGuard.canUserConfirm(userDB, reservation)
        if (!canUserConfirm) throw new InnerError('Пользователю данная операция не доступна!' , 403)
        // Проверка на валидность кода подтверждения
        if (reservation.confirmationCode !== requestBody.confirmation_code) 
            throw new InnerError('Неправильный код подтверждения!', 409)
        // Создание записи действия для оператора
        if ((await this.permissionChecker.check_CanSeeAllReservations(userDB)) 
            && (await this.permissionChecker.check_CanCreateUserActions(userDB))) {
            const actionDescription = `Подтверждение брони Res:${reservation.id}`
            await this.userRepo.createUserAction(userDB.id, actionDescription)
        }
        // Изменение флага подтверждения
        await this.reservationRepo.confirmReservation(idReservation)
    }

    /**
     * * Повторная отправка письма на почту с кодом подтверждения брони
     */
    async resendConfirmationEmail(user: UserRequestOption, idReservation: number) {
        // Получение роли из БД
        const userDB = await this.userRepo.getUser(user.id)
        if (!userDB) throw new InnerError('Пользователь не распознан.', 403) 
        // Проверка на наличие записи в базе данных 
        const reservation = await this.reservationRepo.getReservation(idReservation)
        if (!reservation) throw new InnerError('Бронь не найдена.', 404)
        // Проверка совпадает ли id владельца с id пользователя, который запрашивает подтверждение
        if (user.id !== reservation.user.id)
            throw new InnerError('Вы не можете запросить повторную отправку письма с подтверждением для этой брони!', 403) 
        // Отправка письма на почту с информацией о сеансе и кодом подтверждения
        if ((await this.permissionChecker.check_CanReserveWithoutConfirmation(userDB))) 
            throw new InnerError('Вы можете бронировать без подтверждения. Пожалуйста, обратитесь за помощью в службу поддержки.', 
                500)
        // Проверка данных для подтверждения (флаг подвтержденности и тайм-аут брони)
        if (!(this.reservationGuard.canResendConfirmationEmail(userDB, reservation)))
            throw new InnerError('Вы не можете запросить повторную отправку письма с подтверждением, пока не истёк тайм-аут.', 403)
        // Сгенерировать письмо
        const emailInfo = this.reservationInfrastructure.generateConfirmationMailMessage({
            id_reservation: reservation.id, 
            confirmation_code: reservation.confirmationCode,
            play_title: reservation.session.play.title, 
            timestamp: reservation.session.timestamp,
            auditorium_title: reservation.reservationSlots[0].slot.seat.row.auditorium.title
        })
        // Отправить письмо
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
        const userDB = await this.userRepo.getUser(user.id)
        if (!userDB) throw new InnerError('Пользователь не распознан.', 403) 
        // Проверка на наличие записи в базе данных 
        const reservation = await this.reservationRepo.getReservation(idReservation)
        if (!reservation) throw new InnerError('Бронь не найдена.', 404)
        // Проверка прав
        if (!(await this.reservationGuard.canUserPay(userDB, reservation))) 
            throw new InnerError('У пользователя недостаточно прав для совершения этой операции!', 403)
        // Создание записи действия для оператора
        if ((await this.permissionChecker.check_CanSeeAllReservations(userDB)) 
            && (await this.permissionChecker.check_CanCreateUserActions(userDB))) {
            const actionDescription = `Изменение флага оплаты на ${!reservation.isPaid}`
            await this.userRepo.createUserAction(userDB.id, actionDescription)
        }
        // Изменение флага оплаты и подвтерждения
        await this.reservationRepo.paymentForReservation(idReservation)
    }
}