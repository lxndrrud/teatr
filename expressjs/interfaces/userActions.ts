export interface UserActionBaseInterface {
    id_user: number
    description: string
}

export interface UserActionDatabaseInterface extends UserActionBaseInterface {
    id: number
    created_at: string
}