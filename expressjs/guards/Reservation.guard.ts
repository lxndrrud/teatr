import { User } from "../entities/users"
import { IPermissionChecker } from "../infrastructure/PermissionChecker.infra"
import { ReservationWithoutSlotsInterface } from "../interfaces/reservations"
import { RoleDatabaseInterface } from "../interfaces/roles"


export interface IReservationGuard {
    canUserDelete(reservation: ReservationWithoutSlotsInterface, user: User): Promise<boolean>
    
    canUserConfirm(reservation: ReservationWithoutSlotsInterface, user: User): boolean

    canUserPay(reservation: ReservationWithoutSlotsInterface, user: User): Promise<boolean>
}

export class ReservationGuard implements IReservationGuard {
    private permissionChecker

    constructor(
        permissionCheckerInstance: IPermissionChecker
    ) {
        this.permissionChecker = permissionCheckerInstance
    }

    public async canUserDelete(reservation: ReservationWithoutSlotsInterface, user: User) {
        return (reservation.id_user === user.id && !reservation.session_is_locked)
        || (await this.permissionChecker.check_CanSeeAllReservations(user) 
            && await this.permissionChecker.check_CanDeleteAnotherUserReservations(user) )
    }

    public canUserConfirm(reservation: ReservationWithoutSlotsInterface, user: User) {
        return reservation.id_user === user.id && !reservation.session_is_locked 
            && !reservation.is_confirmed
    }

    public async canUserPay(reservation: ReservationWithoutSlotsInterface, user: User) {
        return await this.permissionChecker.check_CanSeeAllReservations(user)
            && !reservation.is_paid && !reservation.session_is_locked
    }
}