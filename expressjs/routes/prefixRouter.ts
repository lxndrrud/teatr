import { Router, Request, Response } from 'express';
import { playsRouter } from './plays';
import { sessionsRouter } from './sessions';
import { reservationsRouter } from './reservations';

export const prefixRouter = Router();

prefixRouter.use('/plays', playsRouter)
prefixRouter.use('/sessions', sessionsRouter)
prefixRouter.use('/reservations', reservationsRouter)

prefixRouter.get('/', (req: Request, res: Response) => res.send({
    "message": 'Express + TypeScript Server'
}));