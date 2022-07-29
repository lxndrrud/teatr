import { ReservationController } from "../controllers/reservations";
import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth";
import { ReservationDatabaseModel } from "../dbModels/reservations";
import { RoleFetchingModel } from "../services/roles";
import { RoleDatabaseModel } from "../dbModels/roles";
import { SessionDatabaseModel } from "../dbModels/sessions";
import { UserDatabaseModel } from "../dbModels/users";
import { ReservationInfrastructure } from "../infrastructure/Reservation.infra";
import { ReservationGuard } from "../guards/Reservation.guard";
import { ReservationFilterService } from "../services/reservations/ReservationFilter.service";
import { ReservationCRUDService } from "../services/reservations/ReservationCRUD.service";
import { ReservationPaymentService } from "../services/reservations/ReservationPayment.service";
import { EmailSender } from "../utils/email";
import { SessionCRUDService } from "../services/sessions/SessionCRUD.service";
import { SessionInfrastructure } from "../infrastructure/Session.infra";
import { TimestampHelper } from "../utils/timestamp";
import { CodeGenerator } from "../utils/code";
import { UserInfrastructure } from "../infrastructure/User.infra";
import { KnexConnection } from "../knex/connections";

export const reservationsRouter = Router()
const reservationController = new ReservationController(
    new ReservationPaymentService(
        KnexConnection,
        new ReservationDatabaseModel(
            KnexConnection,
            new TimestampHelper()
        ),
        new RoleFetchingModel(new RoleDatabaseModel(KnexConnection)),
        new UserInfrastructure(
            new UserDatabaseModel(KnexConnection)
        ),
        new ReservationGuard()
    ),
    new ReservationCRUDService(
        KnexConnection,
        new ReservationDatabaseModel(
            KnexConnection,
            new TimestampHelper()
        ),
        new RoleFetchingModel(new RoleDatabaseModel(KnexConnection)),
        new SessionCRUDService(
            KnexConnection,
            new SessionDatabaseModel(
                KnexConnection,
                new TimestampHelper()
            ),
            new SessionInfrastructure(
                new SessionDatabaseModel(
                    KnexConnection,
                    new TimestampHelper()
                ),
                new TimestampHelper())
        ),
        new SessionInfrastructure(
            new SessionDatabaseModel(
                KnexConnection,
                new TimestampHelper()
            ),
            new TimestampHelper()),
        new UserInfrastructure(
            new UserDatabaseModel(KnexConnection)
        ),
        new ReservationInfrastructure(
            new ReservationDatabaseModel(
                KnexConnection,
                new TimestampHelper()
            ), 
            new ReservationGuard(),
            new TimestampHelper()
        ),
        new ReservationGuard(),
        new EmailSender(),
        new CodeGenerator()
    ),
    new ReservationFilterService(
        new ReservationDatabaseModel(
            KnexConnection,
            new TimestampHelper()
        ),
        new RoleFetchingModel(new RoleDatabaseModel(KnexConnection)),
        new ReservationInfrastructure(
            new ReservationDatabaseModel(
                KnexConnection,
                new TimestampHelper()
            ), 
            new ReservationGuard(),
            new TimestampHelper()
        ),
        new TimestampHelper()
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
