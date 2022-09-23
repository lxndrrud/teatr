import { Slot } from "../entities/slots"


export interface IReservationInfrastructure {
    calculateReservationTotalCost(slots: Slot[]): number

    generateConfirmationMailMessage(reservationInfo: {
        id_reservation: number;
        confirmation_code: string;
        play_title: string;
        timestamp: string;
        auditorium_title: string;
    }): {
        subject: string;
        message: string;
    }
}

export class ReservationInfrastructure implements IReservationInfrastructure {
    /**
     * * Расчет стоимости брони
     */
    public calculateReservationTotalCost(slots: Slot[]) {
        let totalCost = 0
        for (let slot of slots) {
            totalCost += slot.price
        }
        return totalCost
    }

    /**
     * * Генерация письма с кодом подтверждения для отправки на почту
     */
    public generateConfirmationMailMessage(reservationInfo: {
        id_reservation: number,
        confirmation_code: string,
        play_title: string, 
        timestamp: string, 
        auditorium_title: string
    }) {
        
        return {
            subject: "Бронь в театре на Оборонной", 
            message: `Номер вашей брони (понадобится на кассе): ${reservationInfo.id_reservation.toString()}\n` +
            `Код подтверждения вашей брони: ${reservationInfo.confirmation_code}\n` +
            `Название представления: ${reservationInfo.play_title}\n` +
            `Дата и время представления: ${reservationInfo.timestamp}\n` +
            `Название зала: ${reservationInfo.auditorium_title}\n`
        }
    }
}