export interface SlotInterface {
    id: number
    price: number
    seat_number: number
    row_number: number
    auditorium_title: string
}

export interface SlotWithRowIdInterface extends SlotInterface {
    id_row: number
}

export interface ReservationsSlotsBaseInterface {
    id_slot: number
    id_reservation: number
}

export interface ReservationsSlotsInterface extends ReservationsSlotsBaseInterface {
    id: number
}