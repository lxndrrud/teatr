import { Knex } from "knex"
import { ReservationModel } from "../../dbModels/reservations"
import { User } from "../../entities/users"
import { IReservationGuard } from "../../guards/Reservation.guard"
import { IPermissionChecker } from "../../infrastructure/PermissionChecker.infra"
import { IUserInfrastructure } from "../../infrastructure/User.infra"
import { InnerErrorInterface, isInnerErrorInterface } from "../../interfaces/errors"
import { ReservationConfirmationInterface, ReservationWithoutSlotsInterface } from "../../interfaces/reservations"
import { UserRequestOption } from "../../interfaces/users"
import { IUserRepo } from "../../repositories/User.repo"
import { RoleService } from "../roles"


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
    protected connection
    protected reservationModel
    protected roleService
    protected userInfrastructure
    protected reservationGuard
    protected userRepo
    protected permissionChecker

    constructor(
        connectionInstance: Knex<any, unknown[]>,
        reservationDatabaseInstance: ReservationModel,
        roleServiceInstance: RoleService,
        userInfrastructureInstance: IUserInfrastructure,
        reservationGuardInstance: IReservationGuard,
        userRepoInstance: IUserRepo,
        permissionCheckerInstance: IPermissionChecker
    ) {
        this.connection = connectionInstance
        this.reservationModel = reservationDatabaseInstance
        this.roleService = roleServiceInstance
        this.userInfrastructure = userInfrastructureInstance
        this.reservationGuard = reservationGuardInstance
        this.userRepo = userRepoInstance
        this.permissionChecker = permissionCheckerInstance
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
        const canUserConfirm = this.reservationGuard.canUserConfirm(reservation, userDB)
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
        const trx = await this.connection.transaction()

        // Создание записи действия для оператора
        if (await this.permissionChecker.check_CanSeeAllReservations(userDB)) {
            const actionDescription = `Подтверждение брони Res:${reservation.id}`
            try {
                await this.userRepo.createUserAction(userDB, actionDescription)
                .catch(e => { throw e }) 
            } catch(e) {
                console.log(e)
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера!'
                }
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
        const canUserPay = await this.reservationGuard.canUserPay(reservation, userDB)
        if (!canUserPay) {
            return <InnerErrorInterface>{
                code: 403,
                message: 'У пользователя недостаточно прав для совершения этой операции!'
            }
        }

        // Транзакция: изменение флага оплаты
        const trx = await this.connection.transaction()

        // Создание записи действия для оператора
        if (await this.permissionChecker.check_CanSeeAllReservations(userDB)) {
            const actionDescription = `Изменение флага оплаты на ${!reservation.is_paid}`
            try {
                await this.userRepo.createUserAction(userDB, actionDescription)
                .catch(e => { throw e }) 
            } catch(e) {
                console.log(e)
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера!'
                }
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