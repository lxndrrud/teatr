export interface PlayBaseInterface {
    title: string
    description: string
}

export function isPlayBaseInterface (obj: any): obj is PlayBaseInterface {
    if (obj.title && obj.description) return true
    return false
}

export interface PlayInterface extends PlayBaseInterface {
    id: number
}

export interface PlaySessionFilterOptionInterface {
    title: string
}

export interface PlayReservationFilterOptionInterface {
    title: string
}