import { Router } from "express";
import { SessionController } from "../controllers/sessions";
import { SessionDatabaseModel } from "../dbModels/sessions";
import { SessionFetchingModel } from "../fetchingModels/sessions";
import { basicAuthMiddleware } from "../middlewares/auth";
 
export const sessionsRouter = Router();
const sessionController = new SessionController(new SessionFetchingModel(new SessionDatabaseModel()))

sessionsRouter.get('/play/:idPlay', sessionController.getSessionsByPlay.bind(sessionController))
sessionsRouter.get('/:idSession/slots', basicAuthMiddleware, sessionController.getSlotsForSessions.bind(sessionController))

sessionsRouter.get('/filter', sessionController.getFilteredSessions.bind(sessionController))
sessionsRouter.get('/filter/setup', sessionController.getSessionFilterOptions.bind(sessionController))

sessionsRouter.route('/:idSession')
    .get(basicAuthMiddleware, sessionController.getSingleSession.bind(sessionController))
    .put(basicAuthMiddleware, sessionController.updateSession.bind(sessionController))
    .delete(basicAuthMiddleware, sessionController.deleteSession.bind(sessionController))

sessionsRouter.route('/')
    .get(sessionController.getSessions.bind(sessionController))
    .post(basicAuthMiddleware, sessionController.postSession.bind(sessionController))



