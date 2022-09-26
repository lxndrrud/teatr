import { PlayController } from "../controllers/plays";
import { Router } from "express";
import { PlayService } from "../services/plays/PlayService";
import { AuthMiddleware } from "../middlewares/auth";
import { FileStreamHelper } from "../utils/fileStreams";
import { UserRepo } from "../repositories/User.repo";
import { EmailingTypeRepo } from "../repositories/EmailingType.repo";
import { DatabaseConnection } from "../databaseConnection";
import { Hasher } from "../utils/hasher";
import { PermissionChecker } from "../infrastructure/PermissionChecker.infra";
import { Tokenizer } from "../utils/tokenizer";
import { PlayRepo } from "../repositories/Play.repo";
import { PlayPreparator } from "../infrastructure/PlayPreparator.infra";
import { ErrorHandler } from "../utils/ErrorHandler";
import { PlayRedisRepo } from "../redisRepositories/Play.redis";
import { RedisConnection } from "../redisConnection";

export const playsRouter = Router()
const playController = new PlayController(
    new PlayService(
        new PlayRepo(DatabaseConnection),
        new PlayRedisRepo(RedisConnection),
        new FileStreamHelper(),
        new PlayPreparator()
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

playsRouter.route('/')
    .get(playController.getPlays.bind(playController))
    .post(
        authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        playController.createPlay.bind(playController))
playsRouter.route('/:idPlay')
    .get(playController.getSinglePlay.bind(playController))
    .put(
        authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        playController.updatePlay.bind(playController))
    .delete(
        authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        playController.deletePlay.bind(playController))

playsRouter.route("/csv")
    .post(
        authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        playController.createPlaysCSV.bind(playController))
