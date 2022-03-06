import { getSingleReservation, postReservation } from "../controllers/reservations";
import { Router } from "express";

export const reservationsRouter = Router()


reservationsRouter.route('/')
    .post(postReservation)
reservationsRouter.get('/:idReservation', getSingleReservation)
