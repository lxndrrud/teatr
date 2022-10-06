import express from 'express';
import 'reflect-metadata'
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { CronJob } from 'cron';
import { CronProcessor } from './cron/cron';
import { prefixRouter } from './routes/prefixRouter';
import { logger } from './middlewares/logs';
import { UserRequestOption } from './interfaces/users';
import { DatabaseConnection, InitConnection } from './databaseConnection';
import { SessionRepo } from './repositories/Session.repo';
import { ReservationRepo } from './repositories/Reservation.repo';
import { RedisConnection } from './redisConnection'
import { SessionRedisRepo} from './redisRepositories/Session.redis'
import { SessionFilterRedisRepo } from './redisRepositories/SessionFilter.redis'
import { PlayRedisRepo } from './redisRepositories/Play.redis';

export const app = express();
const cronProcessor = new CronProcessor(
    new SessionRepo(DatabaseConnection),
    new SessionRedisRepo(RedisConnection),
    new SessionFilterRedisRepo(RedisConnection),
    new PlayRedisRepo(RedisConnection),
    new ReservationRepo(DatabaseConnection)
)

InitConnection()

app.use(bodyParser.json())
app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 5 * 1024 * 1024 }
}))
app.use(logger)

app.use('/expressjs', prefixRouter);

declare global {
    namespace Express {
        export interface Request {
            user?: UserRequestOption
        }
    }
}

//export const cronProcess = new CronJob('* * * * *', processTime)
export const everyMinuteCron = new CronJob('* * * * *', cronProcessor.eveyMinuteTask.bind(cronProcessor))
//export const everyMinuteWorkHoursCron = new CronJob('* 9-17 * * *', everyMinuteOnWorkHours)
//export const everyDayCron = new CronJob("0 0 * * *", everyDay)

app.on('shutdown', () => {
    //cronProcess.stop()
    everyMinuteCron.stop()
    //everyMinuteWorkHoursCron.stop()
})