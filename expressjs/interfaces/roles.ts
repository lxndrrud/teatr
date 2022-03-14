export interface RoleBaseInterface {
    title: string
    can_access_private: boolean
    can_make_reservation_without_email: boolean
}

export interface RoleDatabaseInterface extends RoleBaseInterface {
    id: number
}