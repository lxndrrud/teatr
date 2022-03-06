export interface SessionBaseInterface {
    id_play: number
    id_price_policy: number
    timestamp: string
    is_locked: boolean
    max_slots: number
}

export interface SessionInterface extends SessionBaseInterface {
    id: number
    play_title: string
    auditorium_title: string
}

export interface SessionFilterQueryInterface {
    timestamp?: string
    auditorium_title?: string
    play_title?: string
}
