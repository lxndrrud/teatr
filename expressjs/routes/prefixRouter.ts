import { Router, Request, Response } from 'express';
import { playsRouter } from './plays';
import { sessionsRouter } from './sessions';
import { reservationsRouter } from './reservations';
import { usersRouter } from './users';
import { join } from 'path';
import express from 'express';



export const prefixRouter = Router();

//prefixRouter.use('/storage', express.static(join(__dirname, '..', 'storage')))

prefixRouter.use('/plays', playsRouter)
prefixRouter.use('/sessions', sessionsRouter)
prefixRouter.use('/reservations', reservationsRouter)
prefixRouter.use('/users', usersRouter)

prefixRouter.get('/', (req: Request, res: Response) => res.send({
    "message": 'Theatre Reservation Server'
}));