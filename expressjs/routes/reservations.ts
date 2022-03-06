import { getSingleReservation, postReservation, confirmReservation } from "../controllers/reservations";
import { Router } from "express";

export const reservationsRouter = Router()


reservationsRouter.route('/')
    .post(postReservation)
reservationsRouter.route('/:idReservation')
    .get(getSingleReservation)
reservationsRouter.put('/:idReservation/confirm', confirmReservation)