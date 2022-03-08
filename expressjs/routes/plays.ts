import { deletePlay, getPlays, getSinglePlay, createPlay, updatePlay } from "../controllers/plays";
import { Router } from "express";

export const playsRouter = Router()

playsRouter.route('/')
    .get(getPlays)
    .post(createPlay)
playsRouter.route('/:idPlay')
    .get(getSinglePlay)
    .put(updatePlay)
    .delete(deletePlay)
