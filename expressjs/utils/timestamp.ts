import moment, { Moment } from "moment"

export const timestampCreator = (day: number, month: number, 
    year: number, hour: number, minute: number) => {
        return `${year}-${month}-${day}T${hour}:${minute}+0300`
}

export const timestampFromMoment = (moment_: Moment) => {
    return `${moment_.year()}-${moment_.month()}-${moment_.date()}T${moment_.hour()}:${moment_.minute()}+0300`
}

export const momentFromTimestamp = (day: number, month: number, 
    year: number, hour: number, minute: number) => {
        return moment(timestampCreator(day, month, year, hour, minute))
}

export const timestampFromDatabase = (timestamp_: string) => {
    return timestampFromMoment(moment(timestamp_))
}

export const dateFromTimestamp = (timestamp_: string) => {
    return moment(timestamp_).format('YYYY-MM-DD').toString()
        
}

export const extendedDateFromTimestamp = (timestamp_: string) => {
    return moment(timestamp_).locale('ru').format('LLLL').toString()
        .split(',').slice(0, -1).join(',')
}

export const extendedTimestamp = (timestamp_: string) => {
    return moment(timestamp_).locale('ru').format('LLLL').toString()
}

export const getNextDayOfTimestamp = (timestamp_: string) => {
    const nextDayDate = moment(timestamp_).add(1, 'day').format('YYYY-MM-DD').toString()
    return nextDayDate + 'T00:00:00' 
}