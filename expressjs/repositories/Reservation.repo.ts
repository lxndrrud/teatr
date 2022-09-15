import moment from "moment";
import { DataSource } from "typeorm"; 
import { Reservation } from "../entities/reservations";


export interface IReservationRepo {
    checkCanResendConfirmEmail(idReservation: number): Promise<boolean>
} 

export class ReservationRepo implements IReservationRepo {
    private connection
    private reservationRepo

    constructor(
        connectionInstance: DataSource
    ) {
        this.connection = connectionInstance
        this.reservationRepo = this.connection.getRepository(Reservation)
    }

    public async checkCanResendConfirmEmail(idReservation: number) {
        const reservation = await this.reservationRepo.findOne({
            where: {
                id: idReservation
            },
            relations: {
                reservationEmailings: true
            }
        })

        return !!reservation 
            && reservation.reservationEmailings.length === 0 
                ? true
                : moment().isSameOrAfter(moment(reservation?.reservationEmailings[0].timeCreated)
                    .add(reservation?.reservationEmailings[0].emailingType.resendInterval, 'seconds'))

    }
}