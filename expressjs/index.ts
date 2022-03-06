import express from 'express';
import bodyParser from 'body-parser';
import { CronJob } from 'cron';
import { processTime } from './cron/cron';
import { Router, Request, Response } from 'express';
import { playsRouter } from './routes/plays';
import { sessionsRouter } from './routes/sessions';
import { reservationsRouter } from './routes/reservations';

const app = express();
const PORT = 8081;

app.use(bodyParser.json())

const prefixRouter = Router();

prefixRouter.use('/plays', playsRouter)
prefixRouter.use('/sessions', sessionsRouter)
prefixRouter.use('/reservations', reservationsRouter)


app.use('/expressjs', prefixRouter);

prefixRouter.get('/', (req: Request, res: Response) => res.send({
    "message": 'Express + TypeScript Server'
}));

const cronProcess = new CronJob('* * * * *', processTime)

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    cronProcess.start()
});

app.on('shutdown', () => {
    cronProcess.stop()
})