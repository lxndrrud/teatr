import { ReservationCreateInterface, ReservationConfirmationInterface} from "../interfaces/reservations"

export class Reservation {
    constructor() {

    }

    /**
     * * Функция проверки тела запроса на наличие необходимых полей 
     * * для интерфейса создания брони
     */
    public static isReservationCreateInterface (obj: any): obj is ReservationCreateInterface {
    if(obj.id_session && obj.slots) return true
        return false
    }

    /**
     * * Функция проверки тела запроса на наличие необходимых полей 
     * * для интерфейса подтверждения брони
     */
    public static isReservationConfirmationInterface (obj: any): obj is ReservationConfirmationInterface {
        if (obj.confirmation_code) return true
        return false
    }
}