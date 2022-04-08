/**
 * * Интерфейсы для фильтра сеансов
 */
export interface TimestampSessionFilterOptionDatabaseInterface {
    timestamp: string
}

export interface TimestampSessionFilterOptionInterface {
    date: string
    extended_date: string
}

/**
 * * Интерфейсы для фильтра броней
 */
export interface TimestampReservationFilterOptionDatabaseInterface {
    timestamp:string
}

export interface TimestampReservationFilterOptionInterface {
    date: string
    extended_date: string
}