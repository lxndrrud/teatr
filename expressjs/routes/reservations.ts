import { getSingleReservation, postReservation, confirmReservation, deleteReservation,
    getReservations, getReservationFilterOptions, 
    getFilteredReservations, paymentForReservation } from "../controllers/reservations";
import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth";

export const reservationsRouter = Router()


reservationsRouter.route('/')
    .get(basicAuthMiddleware, getReservations)
    .post(basicAuthMiddleware, postReservation)
/**
 * * Использовал ранее, так как не было проверки роли
 * reservationsRouter.get('/user', basicAuthMiddleware, getUserReservations)
 */

 reservationsRouter.get('/filter/setup', basicAuthMiddleware, getReservationFilterOptions)
 reservationsRouter.get('/filter', basicAuthMiddleware, getFilteredReservations)

reservationsRouter.route('/:idReservation')
    .get(basicAuthMiddleware, getSingleReservation)
    .delete(basicAuthMiddleware, deleteReservation)
reservationsRouter.put('/:idReservation/confirm', basicAuthMiddleware, confirmReservation)
reservationsRouter.put('/:idReservation/payment', basicAuthMiddleware, paymentForReservation)
