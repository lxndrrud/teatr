import { SlotInterface } from "./slots"

export interface ReservationPostEmailInterface {
    id_user: number
    id_session: number
    slots: SlotInterface[]
}

export interface ReservationConfirmationInterface {
    id_session: number
    confirmation_code: string
}

export interface ReservationBaseInterface {
    id_session: number
    id_user: number
    code: string
    confirmation_code: string
}

export interface ReservationDatabaseInterface extends ReservationBaseInterface {
    id: number
    is_paid: boolean
    is_confirmed: boolean
    created_at: string
}

export interface ReservationWithoutSlotsInterface extends ReservationDatabaseInterface{
    session_timestamp: string
    play_title: string
}

export interface ReservationInterface extends ReservationWithoutSlotsInterface {
    slots: SlotInterface[]
}