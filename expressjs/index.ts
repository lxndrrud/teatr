import express from 'express';
import bodyParser from 'body-parser';
import { CronJob } from 'cron';
import { processTime } from './cron/cron';
import { prefixRouter } from './routes/prefixRouter';
import { logger } from './middlewares/logs';
import { authMiddleware } from './middlewares/auth';

const app = express();
const PORT = 8081;

app.use(bodyParser.json())
app.use(authMiddleware)
app.use(logger)

app.use('/expressjs', prefixRouter);



const cronProcess = new CronJob('* * * * *', processTime)

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    cronProcess.start()
});

app.on('shutdown', () => {
    cronProcess.stop()
})