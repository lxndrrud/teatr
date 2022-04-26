import { Router } from "express";
import { getSessions, getSessionsByPlay, getSingleSession, 
    postSession, updateSession, deleteSession, getSlotsForSessions, getFilteredSessions, getSessionFilterOptions } from "../controllers/sessions";
import { basicAuthMiddleware } from "../middlewares/auth";
 
export const sessionsRouter = Router();


sessionsRouter.get('/play/:idPlay', getSessionsByPlay)
sessionsRouter.get('/:idSession/slots', getSlotsForSessions)

sessionsRouter.get('/filter', getFilteredSessions)
sessionsRouter.get('/filter/setup', getSessionFilterOptions)

sessionsRouter.route('/:idSession')
    .get(basicAuthMiddleware, getSingleSession)
    .put(basicAuthMiddleware, updateSession)
    .delete(basicAuthMiddleware, deleteSession)

sessionsRouter.route('/')
    .get(getSessions)
    .post(postSession)



