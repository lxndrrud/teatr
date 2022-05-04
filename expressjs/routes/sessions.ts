import { Router } from "express";
import { SessionController } from "../controllers/sessions";
import { SessionDatabaseModel } from "../dbModels/sessions";
import { SessionFetchingModel } from "../fetchingModels/sessions";
import { basicAuthMiddleware } from "../middlewares/auth";
 
export const sessionsRouter = Router();
const sessionController = new SessionController(new SessionFetchingModel(new SessionDatabaseModel()))


sessionsRouter.get('/play/:idPlay', sessionController.getSessionsByPlay)
sessionsRouter.get('/:idSession/slots', basicAuthMiddleware, sessionController.getSlotsForSessions)

sessionsRouter.get('/filter', sessionController.getFilteredSessions)
sessionsRouter.get('/filter/setup', sessionController.getSessionFilterOptions)

sessionsRouter.route('/:idSession')
    .get(basicAuthMiddleware, sessionController.getSingleSession)
    .put(basicAuthMiddleware, sessionController.updateSession)
    .delete(basicAuthMiddleware, sessionController.deleteSession)

sessionsRouter.route('/')
    .get(sessionController.getSessions)
    .post(basicAuthMiddleware, sessionController.postSession)



