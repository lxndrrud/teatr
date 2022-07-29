import { PlayController } from "../controllers/plays";
import { Router } from "express";
import { PlayFetchingModel } from "../services/plays";
import { PlayDatabaseModel } from "../dbModels/plays";
import { basicAuthMiddleware, staffAuthMiddleware } from "../middlewares/auth";
import { FileStreamHelper } from "../utils/fileStreams";
import { KnexConnection } from "../knex/connections";

export const playsRouter = Router()
const playController = new PlayController(
    new PlayFetchingModel(
        KnexConnection,
        new PlayDatabaseModel(KnexConnection),
        new FileStreamHelper())
)

playsRouter.route('/')
    .get(playController.getPlays.bind(playController))
    .post(staffAuthMiddleware, playController.createPlay.bind(playController))
playsRouter.route('/:idPlay')
    .get(playController.getSinglePlay.bind(playController))
    .put(staffAuthMiddleware, playController.updatePlay.bind(playController))
    .delete(staffAuthMiddleware, playController.deletePlay.bind(playController))

playsRouter.route("/csv")
    .post(staffAuthMiddleware, playController.createPlaysCSV.bind(playController))
