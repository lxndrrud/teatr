import { getSingleReservation, postReservation, confirmReservation } from "../controllers/reservations";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";

export const reservationsRouter = Router()


reservationsRouter.route('/')
    .post(postReservation)
reservationsRouter.route('/:idReservation')
    .get(authMiddleware, getSingleReservation)
reservationsRouter.put('/:idReservation/confirm', authMiddleware, confirmReservation)