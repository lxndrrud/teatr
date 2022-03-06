export interface RecordBaseInterface {
    email: string
    firstname?: string
    middlename?: string
    lastname?: string
}

export interface RecordInterface extends RecordBaseInterface{
    id: number
}