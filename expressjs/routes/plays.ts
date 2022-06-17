import { PlayController } from "../controllers/plays";
import { Router } from "express";
import { PlayFetchingModel } from "../fetchingModels/plays";
import { PlayDatabaseModel } from "../dbModels/plays";

export const playsRouter = Router()
const playController = new PlayController(new PlayFetchingModel(new PlayDatabaseModel))

playsRouter.route('/')
    .get(playController.getPlays.bind(playController))
    .post(playController.createPlay.bind(playController))
playsRouter.route('/:idPlay')
    .get(playController.getSinglePlay.bind(playController))
    .put(playController.updatePlay.bind(playController))
    .delete(playController.deletePlay.bind(playController))

playsRouter.route("/csv")
    .post(playController.createPlaysCSV.bind(playController))
