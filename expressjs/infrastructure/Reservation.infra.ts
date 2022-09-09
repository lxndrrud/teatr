import { ReservationModel } from "../dbModels/reservations"
import { User } from "../entities/users"
import { IReservationGuard, ReservationGuard } from "../guards/Reservation.guard"
import { InnerErrorInterface } from "../interfaces/errors"
import { ReservationInterface, ReservationWithoutSlotsInterface } from "../interfaces/reservations"
import { RoleDatabaseInterface } from "../interfaces/roles"
import { SlotInterface } from "../interfaces/slots"
import { TimestampHelper } from "../utils/timestamp"

export interface IReservationInfrastructure {
    fetchReservations(user: User, reservations: ReservationWithoutSlotsInterface[]): 
    Promise<ReservationInterface[] | InnerErrorInterface>

    calculateReservationTotalCost(slots: SlotInterface[]): number

    generateConfirmationMailMessage(reservationInfo: {
        id_reservation: number;
        confirmation_code: string;
        play_title: string;
        timestamp: string;
        auditorium_title: string;
    }): string

    checkUserHasReservedSession(idUser: number, idSession: number): Promise<boolean>
    
}

export class ReservationInfrastructure implements IReservationInfrastructure {
    private reservationModel
    private reservationGuard
    private timestampHelper

    constructor(
        reservationDatabaseInstance: ReservationModel, 
        reservationGuardInstance: IReservationGuard,
        timestampHelperInstance: TimestampHelper
    ) {
        this.reservationModel = reservationDatabaseInstance
        this.reservationGuard = reservationGuardInstance
        this.timestampHelper = timestampHelperInstance
    }

    /**
     * * Вывести полную информацию о бронях с необходимым редактированием
     */
    public async fetchReservations(user: User, reservations: ReservationWithoutSlotsInterface[]): Promise<ReservationInterface[] | InnerErrorInterface> {
        let result: ReservationInterface[] = []  
        for (let reservation of reservations) {
            // Редактирование формата timestamp`ов
            reservation.session_timestamp = this.timestampHelper
                .extendedTimestamp(reservation.session_timestamp)
            reservation.created_at = this.timestampHelper
                .extendedTimestamp(reservation.created_at)

            // Скрыть код подтверждения
            reservation.confirmation_code = ''

            // Поиск зарезервированных мест
            let slots: SlotInterface[]
            try {
                slots = await this.reservationModel.getReservedSlots(reservation.id)
            } catch (e) {
                return <InnerErrorInterface>{
                    code: 500,
                    message: 'Внутренняя ошибка сервера во время поиска слотов!'
                }
            }

            // Проверка на возможность удаления брони
            const canUserDelete = await this.reservationGuard.canUserDelete(reservation, user)

            // Проверка на возможность подтверждения брони
            const canUserConfirm = this.reservationGuard.canUserConfirm(reservation,  user)

            // Проверка на возможность оплаты брони
            const canUserPay = await this.reservationGuard.canUserPay(reservation,  user)
            
            result.push(<ReservationInterface>{
                ...reservation,
                can_user_delete: canUserDelete,
                can_user_confirm: canUserConfirm,
                can_user_pay: canUserPay,
                // Расчет стоимости брони
                total_cost: this.calculateReservationTotalCost(slots),
                slots: slots
            })
        }
        return result
    }

    /**
     * * Расчет стоимости брони
     */
    public calculateReservationTotalCost(slots: SlotInterface[]) {
        let totalCost = 0
        for (let slot of slots) {
            totalCost += slot.price
        }
        return totalCost
    }

    public generateConfirmationMailMessage(reservationInfo: {
        id_reservation: number,
        confirmation_code: string,
        play_title: string, 
        timestamp: string, 
        auditorium_title: string
    }) {
        return `Номер вашей брони (понадобится на кассе): ${reservationInfo.id_reservation.toString()}\n` +
            `Код подтверждения вашей брони: ${reservationInfo.confirmation_code}\n` +
            `Название представления: ${reservationInfo.play_title}\n` +
            `Дата и время представления: ${reservationInfo.timestamp}\n` +
            `Название зала: ${reservationInfo.auditorium_title}\n`
    }

    /**
     * * Проверка наличия у пользователя броней на сеанс
     */
    public async checkUserHasReservedSession (idUser: number, idSession: number): Promise<boolean> {
        const query = await this.reservationModel.getAll({
            id_user: idUser,
            id_session: idSession
        })
        if (query.length > 0) return true
        return false
    }
}