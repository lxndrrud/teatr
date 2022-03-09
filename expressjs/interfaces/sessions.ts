export interface SessionBaseInterface {
    id_play: number
    id_price_policy: number
    timestamp: string
    is_locked: boolean
    max_slots: number
}

export interface SessionDatabaseInterface extends SessionBaseInterface {
    id: number
}

export interface SessionInterface extends SessionDatabaseInterface {
    play_title: string
    auditorium_title: string
}

export interface SessionFilterQueryInterface {
    date?: string
    auditorium_title?: string
    play_title?: string
}
