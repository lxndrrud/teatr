import { PlayController } from "../controllers/plays";
import { Router } from "express";
import { PlayFetchingModel } from "../fetchingModels/plays";
import { PlayDatabaseModel } from "../dbModels/plays";

export const playsRouter = Router()
const playController = new PlayController(new PlayFetchingModel(new PlayDatabaseModel))

playsRouter.route('/')
    .get(playController.getPlays)
    .post(playController.createPlay)
playsRouter.route('/:idPlay')
    .get(playController.getSinglePlay)
    .put(playController.updatePlay)
    .delete(playController.deletePlay)
