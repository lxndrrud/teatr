export interface PlayBaseInterface {
    title: string
    description: string
    crew?: string
}

export function isPlayBaseInterface (obj: any): obj is PlayBaseInterface {
    if (obj.title && obj.description) return true
    return false
}

export interface PlayInterface extends PlayBaseInterface {
    id: number
}

export interface PlayQueryInterface extends Omit<PlayInterface, 'id'|'title'|'description'> {
    id?: number
    title?: string
    description?: string
}

export interface PlayWithPosterInterface {
    title: string
    description: string[]
    crew?: string[]
    poster_filepath: string
}

export interface PlaySessionFilterOptionInterface {
    title: string
}

export interface PlayReservationFilterOptionInterface {
    title: string
}