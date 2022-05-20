import { ReservationModel } from "../../dbModels/reservations";
import { Knex } from "knex";
import { ReservationBaseInterface, ReservationFilterQueryInterface } from "../../interfaces/reservations";
import { ReservationsSlotsBaseInterface } from "../../interfaces/slots";


export class ReservationMockModel implements ReservationModel {
    public reservationsList: any[]

    constructor() {
        this.reservationsList = []
    }

    getAll(payload: {
        id?: number
        created_at?: string 
        is_paid?: boolean
        is_confirmed?: boolean
        confirmation_code?: string
        id_session?: number
        id_user?: number
    }) {
        return this.reservationsList
        
    }

    get(payload: {
        id?: number
        created_at?: string 
        is_paid?: boolean
        is_confirmed?: boolean
        confirmation_code?: string
        id_session?: number
        id_user?: number
    }) {
        if (payload.id === 500) throw new Error("Database mock error")
        for(const reservation of this.reservationsList) {
            if(payload.id && reservation.id === payload.id) {
                return reservation
            }
        }
    }

    insert(trx: Knex.Transaction<any, any[]>, payload: ReservationBaseInterface) {
        if (payload.id_user === 500) throw new Error("Database mock error")
    }

    update(trx: Knex.Transaction<any, any[]>, id: number, payload: {
        created_at?: string 
        is_paid?: boolean
        is_confirmed?: boolean
        confirmation_code?: string
        id_session?: number
        id_user?: number
    }) {
        if (id === 500) throw new Error("Database mock error")
        for(let i=0; i<this.reservationsList.length; i++) {
            if (this.reservationsList[i].id === id) {
                if(payload.is_paid) this.reservationsList[i].is_paid = payload.is_paid
                if(payload.is_confirmed) this.reservationsList[i].is_confirmed = payload.is_confirmed
            }
        }
    }

    delete(trx: Knex.Transaction<any, any[]>, id: number) {
        if (id === 500) throw new Error("Database mock error")
        for (let i=0; i<this.reservationsList.length; i++) {
            if (this.reservationsList[i].id === id) {
                this.reservationsList.splice(i, 1)
                break
            }
        }
    }

    getAllFullInfo() {

    }

    getSingleFullInfo(idReservation: number) {

    }

    getUserReservations (idUser: number) {

    }

    getReservedSlots (idReservation: number)  {

    }

    insertReservationsSlotsList(trx: Knex.Transaction, payloadList: ReservationsSlotsBaseInterface[]) {

    }

    deleteReservationsSlots (trx: Knex.Transaction, idReservation: number) {

    }

    getTimestampsOptionsForReservationFilter(idUser: number | undefined) {

    }

    getAuditoriumsOptionsForReservationFilter(idUser: number | undefined) {

    }

    getPlaysOptionsForReservationFilter(idUser: number | undefined) {

    }

    getFilteredReservations(userQuery: ReservationFilterQueryInterface) {

    }

    getFilteredReservationsForUser(userQuery: ReservationFilterQueryInterface, idUser: number) {

    }
}