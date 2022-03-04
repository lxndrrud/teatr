import express from 'express';
import { CronJob } from 'cron';
import { processTime } from './cron/cron';
import { Router, Request, Response } from 'express';
import { playsRouter } from './routes/plays';
import { sessionsRouter } from './routes/sessions';

const app = express();
const PORT = 8081;

const prefixRouter = Router();

prefixRouter.use('/plays', playsRouter)
prefixRouter.use('/sessions', sessionsRouter)


app.use('/expressjs', prefixRouter);

prefixRouter.get('/', (req: Request, res: Response) => res.send({
    "message": 'Express + TypeScript Server'
}));

const cronProcess = new CronJob('* * * * *', processTime)

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    cronProcess.start()
});