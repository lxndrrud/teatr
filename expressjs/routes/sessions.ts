import { Router } from "express";
import { getSessions, getSessionsByPlay, getSingleSession, 
    postSession, updateSession, deleteSession } from "../controllers/sessions";
 
export const sessionsRouter = Router();

sessionsRouter.get('/', getSessions)
sessionsRouter.get('/:idSession', getSingleSession)
sessionsRouter.get('/play/:idPlay', getSessionsByPlay)
sessionsRouter.post('/', postSession)
sessionsRouter.put('/:idSession', updateSession)
sessionsRouter.delete('/:idSession', deleteSession)


