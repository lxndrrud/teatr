import express from 'express';
import bodyParser from 'body-parser';
import { CronJob } from 'cron';
import { processTime } from './cron/cron';
import { prefixRouter } from './routes/prefixRouter';
import { logger } from './middlewares/logs';
import { UserRequestOption } from './interfaces/users';

export const app = express();

app.use(bodyParser.json())
app.use(logger)

app.use('/expressjs', prefixRouter);

declare global {
    namespace Express {
        export interface Request {
            user?: UserRequestOption
        }
    }
}

export const cronProcess = new CronJob('* * * * *', processTime)

app.on('shutdown', () => {
    cronProcess.stop()
})