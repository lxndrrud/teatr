import { getSingleReservation } from "../controllers/reservations";
import { Router } from "express";

export const reservationsRouter = Router()

reservationsRouter.get('/:idReservation', getSingleReservation)
