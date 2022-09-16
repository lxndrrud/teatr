import moment from "moment"
import { Reservation } from "../entities/reservations"
import { User } from "../entities/users"
import { IPermissionChecker } from "../infrastructure/PermissionChecker.infra"
import { ReservationWithoutSlotsInterface } from "../interfaces/reservations"
import { RoleDatabaseInterface } from "../interfaces/roles"


export interface IReservationGuard {
    canUserDelete(user: User, reservation: Reservation): Promise<boolean>
    
    canUserConfirm(user: User, reservation: Reservation): boolean

    canUserPay(user: User, reservation: Reservation): Promise<boolean>

    canResendConfirmationEmail(user: User, reservation: Reservation): boolean
}

export class ReservationGuard implements IReservationGuard {
    private permissionChecker

    constructor(
        permissionCheckerInstance: IPermissionChecker
    ) {
        this.permissionChecker = permissionCheckerInstance
    }

    public async canUserDelete( user: User, reservation: Reservation) {
        return (reservation.user.id === user.id && !reservation.session.isLocked)
        || (await this.permissionChecker.check_CanSeeAllReservations(user) 
            && await this.permissionChecker.check_CanDeleteAnotherUserReservations(user) )
    }

    public canUserConfirm(user: User, reservation: Reservation) {
        return reservation.user.id === user.id && !reservation.session.isLocked 
            && !reservation.isConfirmed
    }

    public async canUserPay(user: User, reservation: Reservation ) {
        return await this.permissionChecker.check_CanSeeAllReservations(user)
            && !reservation.isPaid && !reservation.session.isLocked
    }

    public canResendConfirmationEmail(user: User, reservation: Reservation) {
        if (reservation.isConfirmed) return false
        if (reservation.reservationEmailings.length === 0) return true
        else return moment().isSameOrAfter(moment(reservation.reservationEmailings[0].timeCreated)
                .add(reservation.reservationEmailings[0].emailingType.resendInterval))
    }
}