import { ReservationController } from "../controllers/reservations";
import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth";
import { ReservationDatabaseModel } from "../dbModels/reservations";
import { RoleFetchingModel } from "../services/roles";
import { RoleDatabaseModel } from "../dbModels/roles";
import { SessionFetchingModel } from "../services/sessions";
import { SessionDatabaseModel } from "../dbModels/sessions";
import { UserFetchingModel } from "../services/users";
import { UserDatabaseModel } from "../dbModels/users";
import { ReservationInfrastructure } from "../infrastructure/Reservation.infra";
import { ReservationGuard } from "../guards/Reservation.guard";
import { ReservationFilterService } from "../services/reservations/ReservationFilter.service";
import { ReservationCRUDService } from "../services/reservations/ReservationCRUD.service";
import { ReservationPaymentService } from "../services/reservations/ReservationPayment.service";

export const reservationsRouter = Router()
const reservationController = new ReservationController(
    new ReservationPaymentService(
        new ReservationDatabaseModel(),
        new RoleFetchingModel(new RoleDatabaseModel()),
        new UserFetchingModel(
            new UserDatabaseModel(), new RoleFetchingModel(new RoleDatabaseModel())
        ),
        new ReservationGuard()
    ),
    new ReservationCRUDService(
        new ReservationDatabaseModel(),
        new RoleFetchingModel(new RoleDatabaseModel()),
        new SessionFetchingModel(new SessionDatabaseModel()),
        new UserFetchingModel(
            new UserDatabaseModel(), new RoleFetchingModel(new RoleDatabaseModel())
        ),
        new ReservationInfrastructure(
            new ReservationDatabaseModel(), new ReservationGuard()
        ),
        new ReservationGuard()
    ),
    new ReservationFilterService(
        new ReservationDatabaseModel(),
        new RoleFetchingModel(new RoleDatabaseModel()),
        new ReservationInfrastructure(
            new ReservationDatabaseModel(), new ReservationGuard()
        ),
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
