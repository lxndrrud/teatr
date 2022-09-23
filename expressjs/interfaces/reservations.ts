import { ReservationSlotDependency, SlotInterface } from "./slots"

/**
 * * Интерфейс для создания брони
 */
export interface ReservationCreateInterface {
    id_session: number
    slots: ReservationSlotDependency[]
}

/**
 * * Функция проверки тела запроса на наличие необходимых полей 
 * * для интерфейса создания брони
 */
export function isReservationCreateInterface (obj: any): obj is ReservationCreateInterface {
    if(obj.id_session && obj.slots) return true
    return false
}

/**
 * * Интерфейс подтверждения брони
 */
export interface ReservationConfirmationInterface {
    confirmation_code: string
}

/**
 * * Функция проверки тела запроса на наличие необходимых полей 
 * * для интерфейса подтверждения брони
 */
export function isReservationConfirmationInterface (obj: any): obj is ReservationConfirmationInterface {
    if (obj.confirmation_code) return true
    return false
}

/**
 * * Интерфейс создания брони в базе данных
 */
export interface ReservationBaseInterface {
    id_session: number
    id_user: number
    confirmation_code: string
}

export interface ReservationBaseWithoutConfirmationInterface extends ReservationBaseInterface {
    is_confirmed?: true
}

/**
 * * Интерфейс записи брони с таблицы брони из базы данных 
 */
export interface ReservationDatabaseInterface extends ReservationBaseInterface {
    id: number
    is_paid: boolean
    is_confirmed: boolean
    created_at: string
}

/**
 * * Неполный интерфейс брони без забронированных мест
 */
export interface ReservationWithoutSlotsInterface extends ReservationDatabaseInterface{
    session_timestamp: string
    session_is_locked: boolean
    auditorium_title: string
    play_title: string
    id_play: number
}

/**
 * * Полный интерфейс брони с забронированными местами
 */
export interface ReservationInterface extends ReservationWithoutSlotsInterface {
    slots: SlotInterface[]
    total_cost: number
    can_user_delete: boolean
    can_user_confirm: boolean
    can_user_pay: boolean
}

export interface ReservationFilterQueryInterface {
    dateFrom: string
    dateTo: string
    auditorium_title: string
    play_title: string
    is_locked: string,
    id_reservation: string
}

export function isReservationFilterQueryInterface(obj: any): obj is ReservationFilterQueryInterface {
    return obj
        && (obj.dateFrom && typeof obj.dateFrom === 'string' ) 

        && (obj.dateTo && typeof obj.dateTo === 'string' ) 
            //|| typeof obj.date === 'undefined' || obj.date === 'undefined')
        && (obj.auditorium_title && typeof obj.auditorium_title === 'string'
            || obj.auditorium_title === 'undefined') 
            //|| typeof obj.auditorium_title === 'undefined' || obj.auditorium_title === 'undefined')
        && (obj.play_title && typeof obj.play_title === 'string'
            || obj.play_title === 'undefined') 
            //|| typeof obj.play_title === 'undefined' || obj.play_title === 'undefined')
        && (obj.is_locked && (typeof obj.is_locked === 'boolean'
            || typeof obj.is_locked === 'string')) 
            //|| typeof obj.is_locked === 'undefined' || obj.is_locked === 'undefined')
        && (obj.id_reservation && typeof obj.id_reservation === 'string' ) 
            //|| typeof obj.id_reservation === 'undefined' || obj.id_reservation === 'undefined')
}