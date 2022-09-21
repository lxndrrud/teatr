export interface SessionBaseInterface {
    id_play: number
    id_price_policy: number
    timestamp: string
    is_locked: boolean
    max_slots: number
}

export function isSessionBaseInterface(obj: any): obj is SessionBaseInterface {
    if(obj.id_play && obj.id_price_policy && obj.timestamp && obj.max_slots && 
        (typeof obj.is_locked === 'boolean')) return true
    return false
}

export interface SessionDatabaseInterface extends SessionBaseInterface {
    id: number
}

export interface SessionInterface extends SessionDatabaseInterface {
    play_title: string
    auditorium_title: string
    poster_filepath: string
}

export interface SessionFilterQueryInterface {
    dateFrom: string | undefined
    dateTo: string | undefined
    auditorium_title: string | undefined
    play_title: string | undefined
}

export function isSessionFilterQueryInterface(obj: any): obj is SessionFilterQueryInterface {
    if ((typeof obj.date ==='string' || typeof obj.date==='undefined') 
        && (typeof obj.auditorium_title === 'string' || typeof obj.auditorium_title === 'undefined')
        && (typeof obj.play_title === 'string' || typeof obj.auditorium_title === 'undefined')) 
            return true
    return false
}
