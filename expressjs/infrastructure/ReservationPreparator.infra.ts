import { Reservation } from "../entities/reservations";
import { User } from "../entities/users";
import { IReservationGuard } from "../guards/Reservation.guard";
import { ReservationInterface } from "../interfaces/reservations";
import { TimestampHelper } from "../utils/timestamp";
import { ISlotPreparator } from "./SlotPreparator.infra";


export interface IReservationPreparator {
    prepareReservation(user: User, reservation: Reservation): Promise<ReservationInterface>
} 

export class ReservationPreparator implements IReservationPreparator {
    private reservationGuard
    private timestampHelper
    private slotPreparator

    constructor(
        reservationGuardInstance: IReservationGuard,
        timestampHelperInstance: TimestampHelper,
        slotPreparatorInstance: ISlotPreparator
    ) {
        this.reservationGuard = reservationGuardInstance
        this.timestampHelper = timestampHelperInstance
        this.slotPreparator = slotPreparatorInstance
    }
    
    /**
     * * Вывести полную информацию о бронях с необходимым редактированием
     */
    public async prepareReservation(user: User, reservation: Reservation): Promise<ReservationInterface> {
        // Проверка на возможность удаления брони
        const canUserDelete = await this.reservationGuard.canUserDelete(user, reservation)
        // Проверка на возможность подтверждения брони
        const canUserConfirm = this.reservationGuard.canUserConfirm(user, reservation)
        // Проверка на возможность оплаты брони
        const canUserPay = await this.reservationGuard.canUserPay(user, reservation)
        const result = <ReservationInterface>  {
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
        // Обработать слоты
        let slots = reservation.reservationSlots.map(resSlot => this.slotPreparator.prepareSlotInterface(resSlot.slot))
        result.slots = slots
        return result
    }
}