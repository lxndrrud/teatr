import moment, { Moment } from "moment"

export const timestampCreator = (day: number, month: number, 
    year: number, hour: number, minute: number) => {
        return `${year}-${month}-${day}T${hour}:${minute}+0300`
    }

export const timestampFromMoment = (moment_: Moment) => {
    return `${moment_.year()}-${moment_.month()}-${moment_.day()}T${moment_.hour()}:${moment_.minute()}+0300`
}

export const momentFromTimestamp = (day: number, month: number, 
    year: number, hour: number, minute: number) => {
        return moment(timestampCreator(day, month, year, hour, minute))
    }