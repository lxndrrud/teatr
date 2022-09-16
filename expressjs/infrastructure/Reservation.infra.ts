import { ReservationModel } from "../dbModels/reservations"
import { Reservation } from "../entities/reservations"
import { Slot } from "../entities/slots"
import { User } from "../entities/users"
import { IReservationGuard, ReservationGuard } from "../guards/Reservation.guard"
import { InnerErrorInterface } from "../interfaces/errors"
import { ReservationInterface, ReservationWithoutSlotsInterface } from "../interfaces/reservations"
import { RoleDatabaseInterface } from "../interfaces/roles"
import { SlotInterface } from "../interfaces/slots"
import { TimestampHelper } from "../utils/timestamp"

export interface IReservationInfrastructure {
    fetchReservations(user: User, reservations: Reservation[]): Promise<ReservationInterface[] | InnerErrorInterface>

    calculateReservationTotalCost(slots: Slot[]): number

    generateConfirmationMailMessage(reservationInfo: {
        id_reservation: number;
        confirmation_code: string;
        play_title: string;
        timestamp: string;
        auditorium_title: string;
    }): {
        subject: string;
        message: string;
    }

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
    public async fetchReservations(user: User, reservations: Reservation[]): Promise<ReservationInterface[] | InnerErrorInterface> {
        let result: ReservationInterface[] = []  
        for (let reservation of reservations) {
            // Проверка на возможность удаления брони
            const canUserDelete = await this.reservationGuard.canUserDelete(user, reservation)

            // Проверка на возможность подтверждения брони
            const canUserConfirm = this.reservationGuard.canUserConfirm(user, reservation)

            // Проверка на возможность оплаты брони
            const canUserPay = await this.reservationGuard.canUserPay(user, reservation)
            let toPush = <ReservationInterface>  {
                id: reservation.id,
                id_play: reservation.session.play.id,
                id_session: reservation.session.id,
                id_user: reservation.user.id,
                is_confirmed: reservation.isConfirmed,
                is_paid: reservation.isPaid,
                play_title: reservation.session.play.title,
                auditorium_title: reservation.reservationSlots[0].slot.seat.row.auditorium.title,
                session_timestamp:  this.timestampHelper
                    .extendedTimestamp(reservation.session.timestamp),
                session_is_locked: reservation.session.isLocked,
                created_at: this.timestampHelper
                    .extendedTimestamp(reservation.createdAt),
                confirmation_code: '',
                can_user_delete: canUserDelete,
                can_user_confirm: canUserConfirm,
                can_user_pay: canUserPay,
            } 

            let slots = reservation.reservationSlots.map(resSlot => {
                return <SlotInterface>{
                    id: resSlot.slot.id,
                    price: resSlot.slot.price,
                    seat_number: resSlot.slot.seat.number,
                    row_number: resSlot.slot.seat.row.number,
                    row_title: resSlot.slot.seat.row.title,
                    auditorium_title: resSlot.slot.seat.row.auditorium.title
                }
            })
            toPush.slots = slots
            
            result.push(toPush)
        }
        return result
    }

    /**
     * * Расчет стоимости брони
     */
    public calculateReservationTotalCost(slots: Slot[]) {
        let totalCost = 0
        for (let slot of slots) {
            totalCost += slot.price
        }
        return totalCost
    }

    /**
     * * Генерация письма с кодом подтверждения для отправки на почту
     */
    public generateConfirmationMailMessage(reservationInfo: {
        id_reservation: number,
        confirmation_code: string,
        play_title: string, 
        timestamp: string, 
        auditorium_title: string
    }) {
        
        return {
            subject: "Бронь в театре на Оборонной", 
            message: `Номер вашей брони (понадобится на кассе): ${reservationInfo.id_reservation.toString()}\n` +
            `Код подтверждения вашей брони: ${reservationInfo.confirmation_code}\n` +
            `Название представления: ${reservationInfo.play_title}\n` +
            `Дата и время представления: ${reservationInfo.timestamp}\n` +
            `Название зала: ${reservationInfo.auditorium_title}\n`
        }
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