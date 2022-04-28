export interface SlotInterface {
    id: number
    price: number
    seat_number: number
    row_number: number
    row_title: string
    auditorium_title: string
}

export interface SlotIsReservedInterface extends SlotInterface {
    is_reserved: boolean
}

export interface SlotWithRowIdInterface extends SlotInterface {
    id_row: number
}

export interface ReservationSlotDependency {
    id: number
}
export interface ReservationsSlotsBaseInterface {
    id_slot: number
    id_reservation: number
}

export interface ReservationsSlotsInterface extends ReservationsSlotsBaseInterface {
    id: number
}