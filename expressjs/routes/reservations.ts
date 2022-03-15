import { getSingleReservation, postReservation, confirmReservation, deleteReservation } from "../controllers/reservations";
import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth";

export const reservationsRouter = Router()


reservationsRouter.route('/')
    .post(postReservation)
reservationsRouter.route('/:idReservation')
    .get(basicAuthMiddleware, getSingleReservation)
    .delete(basicAuthMiddleware, deleteReservation)
reservationsRouter.put('/:idReservation/confirm', basicAuthMiddleware, confirmReservation)