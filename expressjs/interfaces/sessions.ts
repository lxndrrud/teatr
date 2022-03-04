export interface SessionBaseInterface {
    id_play: number
    id_price_policy: number
    date: string
    time: string
    is_locked: boolean
}

export interface SessionInterface extends SessionBaseInterface {
    id: number
    play_title: string
    auditorium_title: string
}

export interface SessionFilterQueryInterface {
    date?: string
    auditorium_title?: string
    play_title?: string
}
