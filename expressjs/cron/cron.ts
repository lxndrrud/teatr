import moment from "moment"
import { SessionDatabaseInterface } from "../interfaces/sessions"
import { KnexConnection } from "../knex/connections"


export const processTime = () => {
    console.log(`cron ${moment()}`)
    processSessions()
    processReservations()
}


const processSessions = async () => {
    const query: SessionDatabaseInterface[] = await KnexConnection('sessions as s')
        .where('s.is_locked', false)
        .orderBy('s.timestamp', 'asc')
    
    const idsArr = []
    for (let session of query) {
        if (moment().isSameOrAfter(moment(session.timestamp)) 
            || moment().add(15, 'minutes').isSameOrAfter(moment(session.timestamp))) {
                idsArr.push(session.id)
        }
        else {
            break
        }
    }

    if  (idsArr.length > 0) {
        console.log(`sessions arr length = ${idsArr.length}`)
        const trx = await KnexConnection.transaction()
        try {
            await trx('sessions')
                .whereIn('id', idsArr)
                .update({
                    'is_locked': true
                })
            await trx.commit()
        } catch (e) {
            await trx.rollback()
            console.log(e)
        }
    }
}

const processReservations = async () => {
    const query = await KnexConnection('reservations as r')
        .where('r.is_confirmed', false)
        .orderBy('r.created_at', 'desc')

    const idsArr = []

    for (let reservation of query) {
        if (moment().isSameOrAfter(moment(reservation.created_at).add(15, 'minutes'))) {
            idsArr.push(reservation.id)
        }
        else {
            break
        }
    }

    if (idsArr.length > 0) {
        console.log(`reservations arr length = ${idsArr.length}`)
        const trx = await KnexConnection.transaction()
        try {
            await trx('reservations_slots')
                .whereIn('id_reservation', idsArr)
                .del()

            await trx('reservations')
                .whereIn('id', idsArr)
                .del()

            await trx.commit()
        } catch (e) {
            await trx.rollback()
            console.log(e)
        }
    } 

}
