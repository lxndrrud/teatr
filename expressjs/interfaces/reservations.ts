import { SlotInterface } from "./slots"

export interface ReservationPostEmailInterface {
    email: string
    id_session: number
    slots: SlotInterface[]
}

export interface ReservationBaseInterface {
    id_session: number
    id_record: number
    code: string
    confirmation_code: string
}

export interface ReservationDatabaseInterface extends ReservationBaseInterface {
    id: number
    is_paid: boolean
    is_confirmed: boolean
    created_at: string
}

export interface ReservationInterface extends ReservationDatabaseInterface {
    session_timestamp: string
    play_title: string
    slots: SlotInterface[]
}