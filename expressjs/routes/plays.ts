import { getPlays } from "../controllers/plays";
import { Router } from "express";

export const playsRouter = Router()

playsRouter.get('/', getPlays)