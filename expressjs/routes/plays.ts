import { PlayController } from "../controllers/plays";
import { Router } from "express";
import { PlayFetchingModel } from "../services/plays";
import { PlayDatabaseModel } from "../dbModels/plays";
import { AuthMiddleware } from "../middlewares/auth";
import { FileStreamHelper } from "../utils/fileStreams";
import { KnexConnection } from "../knex/connections";
import { UserInfrastructure } from "../infrastructure/User.infra";
import { UserDatabaseModel } from "../dbModels/users";
import { UserRepo } from "../repositories/User.repo";
import { EmailingTypeRepo } from "../repositories/EmailingType.repo";
import { DatabaseConnection } from "../databaseConnection";
import { Hasher } from "../utils/hasher";
import { PermissionChecker } from "../infrastructure/PermissionChecker.infra";
import { Tokenizer } from "../utils/tokenizer";

export const playsRouter = Router()
const playController = new PlayController(
    new PlayFetchingModel(
        KnexConnection,
        new PlayDatabaseModel(KnexConnection),
        new FileStreamHelper())
)
const authMiddleware = new AuthMiddleware(
    new UserRepo(DatabaseConnection, 
        new EmailingTypeRepo(DatabaseConnection), 
        new Hasher(), 
        new PermissionChecker(), 
        new Tokenizer()),
    new PermissionChecker(),
    new UserInfrastructure(new UserDatabaseModel(KnexConnection))
)

playsRouter.route('/')
    .get(playController.getPlays.bind(playController))
    .post(
        authMiddleware.staffAuthMiddleware.bind(authMiddleware), 
        playController.createPlay.bind(playController))
playsRouter.route('/:idPlay')
    .get(playController.getSinglePlay.bind(playController))
    .put(
        authMiddleware.staffAuthMiddleware.bind(authMiddleware), 
        playController.updatePlay.bind(playController))
    .delete(
        authMiddleware.staffAuthMiddleware.bind(authMiddleware), 
        playController.deletePlay.bind(playController))

playsRouter.route("/csv")
    .post(
        authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        playController.createPlaysCSV.bind(playController))
