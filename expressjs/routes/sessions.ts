import { Router } from "express";
import { SessionController } from "../controllers/sessions";
import { SessionDatabaseModel } from "../dbModels/sessions";
import { basicAuthMiddleware, staffAuthMiddleware } from "../middlewares/auth";
import { SessionCRUDService } from "../services/sessions/SessionCRUD.service";
import { SessionInfrastructure } from "../infrastructure/Session.infra";
import { SessionCSVService } from "../services/sessions/SessionCSV.service";
import { FileStreamHelper } from "../utils/fileStreams";
import { SessionFilterService } from "../services/sessions/SessionFilter.service";
import { TimestampHelper } from "../utils/timestamp";
 
export const sessionsRouter = Router();
const sessionController = new SessionController(
    new SessionCRUDService(
        new SessionDatabaseModel(
            new TimestampHelper()), 
        new SessionInfrastructure(
            new SessionDatabaseModel(
                new TimestampHelper()
            ),
            new TimestampHelper())),
    new SessionCSVService(
        new FileStreamHelper(), 
        new SessionDatabaseModel(
            new TimestampHelper())),
    new SessionFilterService(
        new SessionDatabaseModel(
            new TimestampHelper()), 
        new SessionInfrastructure(
            new SessionDatabaseModel(
                new TimestampHelper()),
            new TimestampHelper()),
        new TimestampHelper())
)

sessionsRouter.get('/play/:idPlay', sessionController.getSessionsByPlay.bind(sessionController))
sessionsRouter.get('/:idSession/slots', basicAuthMiddleware, sessionController.getSlotsForSessions.bind(sessionController))

sessionsRouter.get('/filter', sessionController.getFilteredSessions.bind(sessionController))
sessionsRouter.get('/filter/setup', sessionController.getSessionFilterOptions.bind(sessionController))

sessionsRouter.route('/:idSession')
    .get(basicAuthMiddleware, sessionController.getSingleSession.bind(sessionController))
    .put(staffAuthMiddleware, sessionController.updateSession.bind(sessionController))
    .delete(staffAuthMiddleware, sessionController.deleteSession.bind(sessionController))

sessionsRouter.route('/')
    .get(sessionController.getSessions.bind(sessionController))
    .post(staffAuthMiddleware, sessionController.postSession.bind(sessionController))

sessionsRouter.route("/csv")
    .post(staffAuthMiddleware, sessionController.createSessionsCSV.bind(sessionController))



