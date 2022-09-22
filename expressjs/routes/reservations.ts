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
import { EmailingTypeRepo } from "../repositories/EmailingType.repo";
import { ReservationRepo } from "../repositories/Reservation.repo";
import { Tokenizer } from "../utils/tokenizer";
import { Hasher } from "../utils/hasher";
import { SessionRepo } from "../repositories/Session.repo";
import { SessionPreparator } from "../infrastructure/SessionPreparator.infra";
import { SlotPreparator } from "../infrastructure/SlotPreparator.infra";
import { ErrorHandler } from "../utils/ErrorHandler";
import { ReservationPreparator } from "../infrastructure/ReservationPreparator.infra";
import { ReservationFilterPreparator } from "../infrastructure/ReservationFilterPreparator.infra";

export const reservationsRouter = Router()
const reservationController = new ReservationController(
    new ReservationPaymentService(
        new ReservationGuard(new PermissionChecker()),
        new UserRepo(DatabaseConnection, 
            new EmailingTypeRepo(DatabaseConnection), 
            new Hasher(), 
            new PermissionChecker(), 
            new Tokenizer()),
        new PermissionChecker(),
        new ReservationRepo(DatabaseConnection),
        new ReservationInfrastructure(
            new ReservationDatabaseModel(
                KnexConnection,
                new TimestampHelper()
            ), 
            new ReservationGuard(new PermissionChecker()),
            new TimestampHelper()
        ),
        new EmailSender()
    ),
    new ReservationCRUDService(
        new SessionRepo(DatabaseConnection),
        new SessionInfrastructure(
            new SessionDatabaseModel(
                KnexConnection,
                new TimestampHelper()
            ),
            new TimestampHelper()),
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
        new UserRepo(DatabaseConnection, 
            new EmailingTypeRepo(DatabaseConnection), 
            new Hasher(), 
            new PermissionChecker(), 
            new Tokenizer()),
        new PermissionChecker(),
        new ReservationRepo(DatabaseConnection),
        new ReservationPreparator(
            new ReservationGuard(new PermissionChecker()),
            new TimestampHelper(),
            new SlotPreparator())
    ),
    new ReservationFilterService(
        new ReservationRepo(DatabaseConnection),
        new UserRepo(DatabaseConnection, 
            new EmailingTypeRepo(DatabaseConnection), 
            new Hasher(), 
            new PermissionChecker(), 
            new Tokenizer()),
        new ReservationPreparator(
            new ReservationGuard(new PermissionChecker()),
            new TimestampHelper(),
            new SlotPreparator()),
        new ReservationFilterPreparator(),
        new TimestampHelper(),
        new PermissionChecker(),
    ),
    SlotsEventEmitter.getInstance(
        new SessionCRUDService(
            new SessionRepo(DatabaseConnection),
            new SessionPreparator(
                new TimestampHelper()
            ),
            new SlotPreparator()
        ),
        new ErrorHandler()
    ),
    new ErrorHandler()
)

const authMiddleware = new AuthMiddleware(
    new UserRepo(DatabaseConnection, 
        new EmailingTypeRepo(DatabaseConnection), 
        new Hasher(), 
        new PermissionChecker(), 
        new Tokenizer()),
    new PermissionChecker(),
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
