import { ReservationController } from "../controllers/reservations";
import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
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
import { SlotsEventEmitter } from "../events/SlotsEmitter";
import { UserRepo } from "../repositories/User.repo";
import { DatabaseConnection } from "../databaseConnection";
import { PermissionChecker } from "../infrastructure/PermissionChecker.infra";

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
        new ReservationGuard(new PermissionChecker()),
        new UserRepo(DatabaseConnection),
        new PermissionChecker()
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
            new ReservationGuard(new PermissionChecker()),
            new TimestampHelper()
        ),
        new ReservationGuard(new PermissionChecker()),
        new EmailSender(),
        new CodeGenerator(),
        new UserRepo(DatabaseConnection),
        new PermissionChecker()
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
            new ReservationGuard(new PermissionChecker()),
            new TimestampHelper()
        ),
        new TimestampHelper(),
        new UserRepo(DatabaseConnection),
        new PermissionChecker()
    ),
    SlotsEventEmitter.getInstance(
        new SessionCRUDService(
            KnexConnection,
            new SessionDatabaseModel(
                KnexConnection,
                new TimestampHelper()), 
            new SessionInfrastructure(
                new SessionDatabaseModel(
                    KnexConnection,
                    new TimestampHelper()
                ),
                new TimestampHelper())),
    )
)

const authMiddleware = new AuthMiddleware(
    new UserInfrastructure(new UserDatabaseModel(KnexConnection))
)


reservationsRouter.route('/')
    .get(
        authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
        reservationController.getReservations.bind(reservationController))
    .post(
        authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
        reservationController.postReservation.bind(reservationController))
/**
 * * Использовал ранее, так как не было проверки роли
 * reservationsRouter.get('/user', basicAuthMiddleware, getUserReservations)
 */

 reservationsRouter.get(
     '/filter/setup', 
    authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
    reservationController.getReservationFilterOptions.bind(reservationController))
 reservationsRouter.get(
    '/filter', 
    authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
    reservationController.getFilteredReservations.bind(reservationController))

reservationsRouter.route('/:idReservation')
    .get(
        authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
        reservationController.getSingleReservation.bind(reservationController))
    .delete(
        authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
        reservationController.deleteReservation.bind(reservationController))
reservationsRouter.put(
    '/:idReservation/confirm', 
    authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
    reservationController.confirmReservation.bind(reservationController))
reservationsRouter.put(
    '/:idReservation/payment', 
    authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
    reservationController.paymentForReservation.bind(reservationController))
