import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { CronJob } from 'cron';
import { everyDay, everyMinute } from './cron/cron';
import { prefixRouter } from './routes/prefixRouter';
import { logger } from './middlewares/logs';
import { UserRequestOption } from './interfaces/users';

export const app = express();

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
export const everyMinuteCron = new CronJob('* * * * *', everyMinute)
//export const everyMinuteWorkHoursCron = new CronJob('* 9-17 * * *', everyMinuteOnWorkHours)
export const everyDayCron = new CronJob("0 0 * * *", everyDay)

app.on('shutdown', () => {
    //cronProcess.stop()
    everyMinuteCron.stop()
    //everyMinuteWorkHoursCron.stop()
    everyDayCron.stop()
})