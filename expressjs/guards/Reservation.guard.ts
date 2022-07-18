import { ReservationWithoutSlotsInterface } from "../interfaces/reservations"
import { RoleDatabaseInterface } from "../interfaces/roles"


export interface IReservationGuard {
    canUserDelete(
        reservation: ReservationWithoutSlotsInterface, 
        idUser: number, 
        userRole: RoleDatabaseInterface): 
    boolean
    
    canUserConfirm(
            reservation: ReservationWithoutSlotsInterface, 
            idUser: number, 
            userRole: RoleDatabaseInterface):
    boolean

        canUserPay(
            reservation: ReservationWithoutSlotsInterface, 
            idUser: number, 
            userRole: RoleDatabaseInterface): 
    boolean
}

export class ReservationGuard implements IReservationGuard {
    public canUserDelete(reservation: ReservationWithoutSlotsInterface, idUser: number, userRole: RoleDatabaseInterface) {
        return (reservation.id_user === idUser && !reservation.session_is_locked)
        || (userRole.can_see_all_reservations && userRole.can_access_private)
    }

    public canUserConfirm(reservation: ReservationWithoutSlotsInterface, idUser: number, userRole: RoleDatabaseInterface) {
        return reservation.id_user === idUser && !reservation.session_is_locked 
            && !reservation.is_confirmed
    }

    public canUserPay(reservation: ReservationWithoutSlotsInterface, idUser: number, userRole: RoleDatabaseInterface) {
        return userRole.can_see_all_reservations 
            && !reservation.is_paid && !reservation.session_is_locked
    }
}