import express from 'express';
import 'dotenv/config'
import bodyParser from 'body-parser';
import { CronJob } from 'cron';
import { processTime } from './cron/cron';
import { prefixRouter } from './routes/prefixRouter';
import { logger } from './middlewares/logs';
import { UserRequestOption } from './interfaces/users';

const app = express();
const PORT = 8081;

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

const cronProcess = new CronJob('* * * * *', processTime)

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    cronProcess.start()
});

app.on('shutdown', () => {
    cronProcess.stop()
})