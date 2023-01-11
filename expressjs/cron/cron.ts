import moment from "moment"
import { ISessionRepo } from "../repositories/Session.repo"
import { IReservationRepo } from "../repositories/Reservation.repo"
import { ISessionRedisRepo } from "../redisRepositories/Session.redis"
import { ISessionFilterRedisRepo } from "../redisRepositories/SessionFilter.redis"
import { IPlayRedisRepo } from "../redisRepositories/Play.redis"

export interface ICronProcessor {
    eveyMinuteTask(): void
}

export class CronProcessor implements ICronProcessor {
    private sessionRepo
    private sessionRedisRepo
    private sessionFilterRedisRepo
    private playRedisRepo
    private reservationsRepo

    constructor(
        sessionRepoInstance: ISessionRepo,
        sessionRedisRepoInstance: ISessionRedisRepo,
        sessionFilterRedisRepoInstance: ISessionFilterRedisRepo,
        playRedisRepoInstance: IPlayRedisRepo,
        reservationRepoInstance: IReservationRepo
    ) {
        this.sessionRepo = sessionRepoInstance
        this.sessionRedisRepo = sessionRedisRepoInstance
        this.sessionFilterRedisRepo = sessionFilterRedisRepoInstance
        this.playRedisRepo = playRedisRepoInstance
        this.reservationsRepo = reservationRepoInstance
    }

    public async eveyMinuteTask() {
        console.log('1m cron task')
        await Promise.all([
            this.processSessions(),
            this.processReservations()
        ])
    }

    private async processSessions() {
        try {
            const sessionIDs = await this.sessionRepo.lockSessions(moment().add(15, 'minutes')
                .format('YYYY-MM-DDThh:mm:ss').toString())
            for (const idSession of sessionIDs) {
                await this.sessionRedisRepo.clearSession(idSession)
            }
            await Promise.all([
                this.sessionFilterRedisRepo.clearFilteredSessions(),
                this.playRedisRepo.clearUnlockedPlays()
            ])
           
        } catch (error) {
            console.log(error)
        }
    }

    private async processReservations() {
        try {
            await this.reservationsRepo.deleteReservationsCron(moment().subtract(15, 'minutes')
                .format('YYYY-MM-DDThh:mm:ss').toString())
        } catch (error) {
             console.log(error)           
        }
    }
}


/*
export const processTime = () => {
    console.log(`cron ${moment()}`)
    processSessions()
    processReservations()
}

export const everyMinute = () => {
    console.log(`1m cron ${moment()}`)
    processReservations()
    processSessions()

}

export const everyMinuteOnWorkHours = () => {
    console.log(`1m cron work hours ${moment()}`)
}

export const everyDay = () => {
    console.log(`1d cron ${moment()}`)
    deleteIntersectionReservations()
}


const processSessions = async () => {
    const query: SessionDatabaseInterface[] = await KnexConnection(`${sessions} as s`)
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

    if (idsArr.length > 0) {
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
    const query = await KnexConnection(`${reservations} as r`)
            .select('r.*', 
                's.is_locked as session_is_locked', 's.timestamp as session_timestamp')
            .join(`${sessions} as s`,'s.id', 'r.id_session')
            //.where('r.is_confirmed', false)
            .where("s.is_locked", false)

    const idsArr = []

    for (let reservation of query) {
        // Удаление неподтвержденной брони спустя 15 минут после её создания
        if (moment().isSameOrAfter(moment(reservation.created_at).add(15, 'minutes'))
        && !reservation.is_confirmed) {
            idsArr.push(reservation.id)
        }
        // Удаление неоплаченной брони за 15 минут до начала сеанса
        else if (moment().add(15, 'minutes').isSameOrAfter(moment(reservation.session_timestamp))
        && !reservation.paid) {
            idsArr.push(reservation.id)
        }
    }

    if (idsArr.length > 0) {
        console.log(`reservations arr length = ${idsArr.length}`)
        const trx = await KnexConnection.transaction()
        try {
            await trx(reservationsSlots)
                .whereIn('id_reservation', idsArr)
                .del()

            await trx(reservations)
                .whereIn('id', idsArr)
                .del()

            await trx.commit()
        } catch (e) {
            await trx.rollback()
            console.log(e)
        }
    } 

}

/**
 * Неоплаченные брони, которые создались менее чем за 30 минут до начала сеанса
 * будут висеть на сайте, хотя должны быть удалены
 *-/
const deleteIntersectionReservations = async () => {
    const query = await KnexConnection(`${reservations} as r`)
        .select("r.id")
        .join(`${sessions} as s`, 's.id', 'r.id_session')
        .where('s.is_locked', true)
        .andWhere('r.is_paid', false)
    
    let idsArr = []
    for (let reservation of query) {
        idsArr.push(reservation.id)
    }
    
    if (query.length > 0) {
        console.log(`reservations locked arr length = ${idsArr.length}`)
        const trx = await KnexConnection.transaction()
        try {
            await trx(reservations)
                .whereIn('id', idsArr)
                .del()
            await trx.commit()
        } catch (e) {
            await trx.rollback()
            console.log(e)
        }
        
    }
}
*/
