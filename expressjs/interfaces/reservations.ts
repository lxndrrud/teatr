import { SlotInterface } from "./slots"

/**
 * * Интерфейс для создания брони
 */
export interface ReservationCreateInterface {
    id_session: number
    slots: SlotInterface[]
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
    id_session: number
    // code: string
    confirmation_code: string
}

/**
 * * Функция проверки тела запроса на наличие необходимых полей 
 * * для интерфейса подтверждения брони
 */
export function isReservationConfirmationInterface (obj: any): obj is ReservationConfirmationInterface {
    if (obj.id_session && obj.confirmation_code) return true
    return false
}

/**
 * * Интерфейс создания брони в базе данных
 */
export interface ReservationBaseInterface {
    id_session: number
    id_user: number
    //code: string
    confirmation_code: string
}

export interface ReservationBaseWithoutConfirmationInterface extends ReservationBaseInterface {
    is_confirmed: true
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
    total_cost: number
}

/**
 * * Полный интерфейс брони с забронированными местами
 */
export interface ReservationInterface extends ReservationWithoutSlotsInterface {
    slots: SlotInterface[]
    can_user_delete: boolean
    can_user_confirm: boolean
}