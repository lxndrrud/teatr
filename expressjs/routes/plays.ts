import { deletePlay, getPlays, getSinglePlay, postPlay, updatePlay } from "../controllers/plays";
import { Router } from "express";

export const playsRouter = Router()

playsRouter.get('/', getPlays)
playsRouter.post('/', postPlay)
playsRouter.get('/:idPlay', getSinglePlay)
playsRouter.put('/:idPlay', updatePlay)
playsRouter.delete('/:idPlay', deletePlay)