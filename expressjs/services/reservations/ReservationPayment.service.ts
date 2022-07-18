import { ReservationModel } from "../../dbModels/reservations"
import { IReservationGuard } from "../../guards/Reservation.guard"
import { InnerErrorInterface, isInnerErrorInterface } from "../../interfaces/errors"
import { ReservationConfirmationInterface, ReservationWithoutSlotsInterface } from "../../interfaces/reservations"
import { UserRequestOption } from "../../interfaces/users"
import { KnexConnection } from "../../knex/connections"
import { RoleService } from "../roles"
import { UserService } from "../users"


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
    protected reservationModel
    protected roleService
    protected userService
    protected reservationGuard

    constructor(
            reservationDatabaseInstance: ReservationModel,
            roleServiceInstance: RoleService,
            userServiceInstance: UserService,
            reservationGuardInstance: IReservationGuard
        ) {
        this.reservationModel = reservationDatabaseInstance
        this.roleService = roleServiceInstance
        this.userService = userServiceInstance
        this.reservationGuard = reservationGuardInstance
    }

    /**
     * * Подтверждение брони
     */
    async confirmReservation(user: UserRequestOption, idReservation: number, 
        requestBody: ReservationConfirmationInterface) {
        // Получение роли из БД
        let userRole = await this.roleService.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        // Проверка на наличие записи в базе данных 
        let reservation: ReservationWithoutSlotsInterface | undefined

        try {
            reservation = await this.reservationModel.getSingleFullInfo(idReservation)
        } catch (e) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера во время поиска брони!'
            }
        }
        if (!reservation) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Запись не найдена!'
            }
        }

        // Проверка на доступность подтверждения
        const canUserConfirm = this.reservationGuard.canUserConfirm(reservation, user.id, userRole)
        if (!canUserConfirm) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'Пользователю данная операция не доступна!' 
            }
        }

        // Проверка на валидность кода подтверждения
        if (reservation.confirmation_code !== requestBody.confirmation_code) {
            return <InnerErrorInterface>{
                code: 409,
                message: 'Неправильный код подтверждения!'
            }
        }

        // Транзакция: изменение флага подтверждения
        const trx = await KnexConnection.transaction()

        // Создание записи действия для оператора
        if (userRole.can_see_all_reservations) {
            const actionDescription = `Подтверждение брони Res:${reservation.id}`
            const response = await this.userService
                .createAction(trx, user.id, userRole, actionDescription)
            if (isInnerErrorInterface(response)) {
                return response
            }
        }

        try {
            await this.reservationModel.update(trx, reservation.id, {
                is_confirmed: true
            })
            await trx.commit()
        } catch (e) { 
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Ошибка в изменении записи!'
            }
        }
    }

    /**
     * * Изменение статуса оплаты (из false в true)
     */
    async paymentForReservation(user: UserRequestOption, idReservation: number) {
        // Получение роли из БД
        let userRole = await this.roleService.getUserRole(user.id, user.id_role)
        
        if (isInnerErrorInterface(userRole)) {
            return userRole
        }

        // Проверка на наличие записи в базе данных 
        let reservation: ReservationWithoutSlotsInterface | undefined

        try {
            reservation = await this.reservationModel.getSingleFullInfo(idReservation)
        } catch (e) {
            return <InnerErrorInterface>{
                code: 500,
                message: 'Внутренняя ошибка сервера во время поиска брони!'
            }
        }
        if (!reservation) {
            return <InnerErrorInterface>{
                code: 404,
                message: 'Запись не найдена!'
            }
        }

        // Проверка прав
        const canUserPay = this.reservationGuard.canUserPay(reservation, user.id, userRole)
        if (!canUserPay) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'У пользователя недостаточно прав для совершения этой операции!'
            }
        }

        // Транзакция: изменение флага оплаты
        const trx = await KnexConnection.transaction()

        // Создание записи действия для оператора
        if (userRole.can_see_all_reservations) {
            const actionDescription = `Изменение флага оплаты на ${!reservation.is_paid}`
            const response = await this.userService
                .createAction(trx, user.id, userRole, actionDescription)
            if (isInnerErrorInterface(response)) {
                return response
            }
        }

        try {
            await this.reservationModel.update(trx, reservation.id, {
                is_paid: !reservation.is_paid,
                is_confirmed: true
            })
            await trx.commit()
        } catch (e) { 
            console.log(e)
            await trx.rollback()
            return <InnerErrorInterface>{
                code: 500,
                message: 'Ошибка в изменении записи!'
            }
        }
    }
}