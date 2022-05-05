export interface AuditoriumSessionFilterOption {
    title: string
}

export interface AuditoriumReservationFilterOption {
    title: string
}

export interface AuditoriumBaseInterface {
    title: string
}

export interface AuditoriumDatabaseInterface extends AuditoriumBaseInterface {
    id: number
}