import { ReservationController } from "../controllers/reservations";
import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth";
import { ReservationFetchingModel } from "../fetchingModels/reservations";
import { ReservationDatabaseModel } from "../dbModels/reservations";
import { RoleFetchingModel } from "../fetchingModels/roles";
import { RoleDatabaseModel } from "../dbModels/roles";
import { SessionFetchingModel } from "../fetchingModels/sessions";
import { SessionDatabaseModel } from "../dbModels/sessions";
import { UserFetchingModel } from "../fetchingModels/users";
import { UserDatabaseModel } from "../dbModels/users";

export const reservationsRouter = Router()
const reservationController = new ReservationController(
    new ReservationFetchingModel(
        new ReservationDatabaseModel(),
        new RoleFetchingModel(new RoleDatabaseModel()),
        new SessionFetchingModel(new SessionDatabaseModel()),
        new UserFetchingModel(
            new UserDatabaseModel(), new RoleFetchingModel(new RoleDatabaseModel())
        )
    )
)


reservationsRouter.route('/')
    .get(basicAuthMiddleware, reservationController.getReservations.bind(reservationController))
    .post(basicAuthMiddleware, reservationController.postReservation.bind(reservationController))
/**
 * * Использовал ранее, так как не было проверки роли
 * reservationsRouter.get('/user', basicAuthMiddleware, getUserReservations)
 */

 reservationsRouter.get(
     '/filter/setup', 
    basicAuthMiddleware, 
    reservationController.getReservationFilterOptions.bind(reservationController))
 reservationsRouter.get(
    '/filter', 
    basicAuthMiddleware, 
    reservationController.getFilteredReservations.bind(reservationController))

reservationsRouter.route('/:idReservation')
    .get(basicAuthMiddleware, reservationController.getSingleReservation.bind(reservationController))
    .delete(basicAuthMiddleware, reservationController.deleteReservation.bind(reservationController))
reservationsRouter.put(
    '/:idReservation/confirm', 
    basicAuthMiddleware, 
    reservationController.confirmReservation.bind(reservationController))
reservationsRouter.put(
    '/:idReservation/payment', 
    basicAuthMiddleware, 
    reservationController.paymentForReservation.bind(reservationController))
