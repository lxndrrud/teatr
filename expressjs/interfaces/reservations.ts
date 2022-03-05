export interface SlotInterface {
    id: number
    price: number
    seat_number: number
    row_number: number
    auditorium_title: string
}

export interface ReservationInterface {
    id: number
    id_session: number
    id_record: number
    created_at: string
    is_paid: boolean
    is_confirmed: boolean
    code: string
    confirmation_code: string
    session_timestamp: string
    play_title: string
    slots: SlotInterface[]
}