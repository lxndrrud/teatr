import { Router } from "express";
import { getSessions, getSessionsByPlay, getSingleSession, 
    postSession, updateSession, deleteSession, getSlotsForSessions, getFilteredSessions, getSessionFilterOptions } from "../controllers/sessions";
 
export const sessionsRouter = Router();


sessionsRouter.get('/play/:idPlay', getSessionsByPlay)
sessionsRouter.get('/:idSession/slots', getSlotsForSessions)

sessionsRouter.get('/filter', getFilteredSessions)
sessionsRouter.get('/filterSetup', getSessionFilterOptions)

sessionsRouter.route('/:idSession')
    .get(getSingleSession)
    .put(updateSession)
    .delete(deleteSession)

sessionsRouter.route('/')
    .get(getSessions)
    .post(postSession)



