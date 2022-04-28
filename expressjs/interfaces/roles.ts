export interface RoleBaseInterface {
    title: string
    can_have_more_than_one_reservation_on_session: boolean
    can_see_all_reservations: boolean
    can_access_private: boolean
    can_make_reservation_without_confirmation: boolean
    can_avoid_max_slots_property: boolean
}

export interface RoleDatabaseInterface extends RoleBaseInterface {
    id: number
}