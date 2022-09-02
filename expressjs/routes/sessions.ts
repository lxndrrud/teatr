import { Router } from "express";
import { SessionController } from "../controllers/sessions";
import { SessionDatabaseModel } from "../dbModels/sessions";
import { AuthMiddleware } from "../middlewares/auth";
import { SessionCRUDService } from "../services/sessions/SessionCRUD.service";
import { SessionInfrastructure } from "../infrastructure/Session.infra";
import { SessionCSVService } from "../services/sessions/SessionCSV.service";
import { FileStreamHelper } from "../utils/fileStreams";
import { SessionFilterService } from "../services/sessions/SessionFilter.service";
import { TimestampHelper } from "../utils/timestamp";
import { KnexConnection } from "../knex/connections";
import { SlotsEventEmitter } from "../events/SlotsEmitter";
import { UserInfrastructure } from "../infrastructure/User.infra";
import { UserDatabaseModel } from "../dbModels/users";
 
export const sessionsRouter = Router();
const sessionController = new SessionController(
    new SessionCRUDService(
        KnexConnection,
        new SessionDatabaseModel(
            KnexConnection,
            new TimestampHelper()), 
        new SessionInfrastructure(
            new SessionDatabaseModel(
                KnexConnection,
                new TimestampHelper()
            ),
            new TimestampHelper())),
    new SessionCSVService(
        KnexConnection,
        new FileStreamHelper(), 
        new SessionDatabaseModel(
            KnexConnection,
            new TimestampHelper())),
    new SessionFilterService(
        new SessionDatabaseModel(
            KnexConnection,
            new TimestampHelper()), 
        new SessionInfrastructure(
            new SessionDatabaseModel(
                KnexConnection,
                new TimestampHelper()),
            new TimestampHelper()),
        new TimestampHelper()),
    SlotsEventEmitter.getInstance(
        new SessionCRUDService(
            KnexConnection,
            new SessionDatabaseModel(
                KnexConnection,
                new TimestampHelper()), 
            new SessionInfrastructure(
                new SessionDatabaseModel(
                    KnexConnection,
                    new TimestampHelper()
                ),
                new TimestampHelper())),
    )
)

const authMiddleware = new AuthMiddleware(
    new UserInfrastructure(new UserDatabaseModel(KnexConnection))
)

sessionsRouter.get('/play/:idPlay', sessionController.getSessionsByPlay.bind(sessionController))
sessionsRouter.get('/:idSession/slots', 
    authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
    sessionController.getSlotsForSessions.bind(sessionController))

sessionsRouter.get(
    "/:idSession/slots/polling", 
    authMiddleware.basicAuthMiddleware.bind(authMiddleware),
    sessionController.getSlotsLongPolling.bind(sessionController)    
)

sessionsRouter.get('/filter', sessionController.getFilteredSessions.bind(sessionController))
sessionsRouter.get('/filter/setup', sessionController.getSessionFilterOptions.bind(sessionController))

sessionsRouter.route('/:idSession')
    .get(
        authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
        sessionController.getSingleSession.bind(sessionController))
    .put(
        authMiddleware.staffAuthMiddleware.bind(authMiddleware), 
        sessionController.updateSession.bind(sessionController))
    .delete(
        authMiddleware.staffAuthMiddleware.bind(authMiddleware), 
        sessionController.deleteSession.bind(sessionController))

sessionsRouter.route('/')
    .get(sessionController.getSessions.bind(sessionController))
    .post(
        authMiddleware.staffAuthMiddleware.bind(authMiddleware), 
        sessionController.postSession.bind(sessionController))

sessionsRouter.route("/csv")
    .post(
        authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        sessionController.createSessionsCSV.bind(sessionController))



