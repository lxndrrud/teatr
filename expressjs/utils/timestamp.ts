import moment, { Moment } from "moment"

export class TimestampHelper {
    public timestampCreator(day: number, month: number, 
        year: number, hour: number, minute: number) {
            return `${year}-${month}-${day}T${hour}:${minute}+0300`
    }
    
    public timestampFromMoment(moment_: Moment) {
        return `${moment_.year()}-${moment_.month()}-${moment_.date()}T${moment_.hour()}:${moment_.minute()}+0300`
    }
    
    public momentFromTimestamp(day: number, month: number, 
        year: number, hour: number, minute: number) {
            return moment(this.timestampCreator(day, month, year, hour, minute))
    }
    
    public timestampFromDatabase(timestamp_: string) {
        return this.timestampFromMoment(moment(timestamp_))
    }
    
    public dateFromTimestamp(timestamp_: string) {
        return moment(timestamp_).format('YYYY-MM-DD').toString()
            
    }
    
    public extendedDateFromTimestamp(timestamp_: string) {
        return moment(timestamp_).locale('ru').format('LLLL').toString()
            .split(',').slice(0, -1).join(',')
    }
    
    public extendedTimestamp(timestamp_: string) {
        return moment(timestamp_).locale('ru').format('LLLL').toString()
    }
    
    public getNextDayOfTimestamp(timestamp_: string) {
        const nextDayDate = moment(timestamp_).add(1, 'day').format('YYYY-MM-DD').toString()
        return nextDayDate + 'T00:00:00' 
    }
}