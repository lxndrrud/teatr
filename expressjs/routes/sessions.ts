import { Router } from "express";
import { SessionController } from "../controllers/sessions";
import { AuthMiddleware } from "../middlewares/auth";
import { SessionCRUDService } from "../services/sessions/SessionCRUD.service";
import { SessionCSVService } from "../services/sessions/SessionCSV.service";
import { FileStreamHelper } from "../utils/fileStreams";
import { SessionFilterService } from "../services/sessions/SessionFilter.service";
import { TimestampHelper } from "../utils/timestamp";
import { SlotsEventEmitter } from "../events/SlotsEmitter";
import { ErrorHandler } from "../utils/ErrorHandler";
import { SessionRepo } from "../repositories/Session.repo";
import { DatabaseConnection } from "../databaseConnection";
import { SessionPreparator } from "../infrastructure/SessionPreparator.infra";
import { SessionFilterPreparator } from "../infrastructure/SessionFilterPreparator.infra";
import { SlotPreparator } from "../infrastructure/SlotPreparator.infra";
import { UserRepo } from "../repositories/User.repo";
import { PermissionChecker } from "../infrastructure/PermissionChecker.infra";
import { EmailingTypeRepo } from "../repositories/EmailingType.repo";
import { Hasher } from "../utils/hasher";
import { Tokenizer } from "../utils/tokenizer";
import { SessionRedisRepo } from "../redisRepositories/Session.redis";
import { RedisConnection } from "../redisConnection";
import { SessionFilterRedisRepo } from "../redisRepositories/SessionFilter.redis";
 
export const sessionsRouter = Router();
const sessionController = new SessionController(
    new SessionCRUDService(
        new SessionRepo(DatabaseConnection),
        new SessionRedisRepo(RedisConnection),
        new SessionFilterRedisRepo(RedisConnection),
        new SessionPreparator(
            new TimestampHelper()
        ),
        new SlotPreparator()
    ),
    new SessionCSVService(
        new FileStreamHelper(),
        new SessionRepo(DatabaseConnection)
    ),
    new SessionFilterService(
        new SessionRepo(DatabaseConnection),
        new SessionFilterRedisRepo(RedisConnection),
        new SessionPreparator(
            new TimestampHelper()
        ),
        new TimestampHelper(),
        new SessionFilterPreparator()
    ),
    SlotsEventEmitter.getInstance(
        new SessionCRUDService(
            new SessionRepo(DatabaseConnection),
            new SessionRedisRepo(RedisConnection),
            new SessionFilterRedisRepo(RedisConnection),
            new SessionPreparator(
                new TimestampHelper()
            ),
            new SlotPreparator()
        ),
        new ErrorHandler()
    ), 
    new ErrorHandler()
)

const authMiddleware = new AuthMiddleware(
    new UserRepo(DatabaseConnection, 
        new EmailingTypeRepo(DatabaseConnection), 
        new Hasher(), 
        new PermissionChecker(), 
        new Tokenizer()),
    new PermissionChecker(),
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
        authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        sessionController.updateSession.bind(sessionController))
    .delete(
        authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        sessionController.deleteSession.bind(sessionController))

sessionsRouter.route('/')
    .get(sessionController.getSessions.bind(sessionController))
    .post(
        authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        sessionController.postSession.bind(sessionController))

sessionsRouter.route("/csv")
    .post(
        authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        sessionController.createSessionsCSV.bind(sessionController))



