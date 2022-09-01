import { PlayController } from "../controllers/plays";
import { Router } from "express";
import { PlayFetchingModel } from "../services/plays";
import { PlayDatabaseModel } from "../dbModels/plays";
import { AuthMiddleware } from "../middlewares/auth";
import { FileStreamHelper } from "../utils/fileStreams";
import { KnexConnection } from "../knex/connections";
import { UserInfrastructure } from "../infrastructure/User.infra";
import { UserDatabaseModel } from "../dbModels/users";

export const playsRouter = Router()
const playController = new PlayController(
    new PlayFetchingModel(
        KnexConnection,
        new PlayDatabaseModel(KnexConnection),
        new FileStreamHelper())
)
const authMiddleware = new AuthMiddleware(
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
        authMiddleware.staffAuthMiddleware.bind(authMiddleware), 
        playController.createPlaysCSV.bind(playController))
