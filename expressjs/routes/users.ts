import { UserController } from "../controllers/users";
import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { UserFetchingModel } from "../services/users/UsersCRUD.service";
import { UserCSVService } from '../services/users/UsersCSV.service'
import { UserInfrastructure } from "../infrastructure/User.infra"
import { KnexConnection } from "../knex/connections";
import { UserGuard } from "../guards/User.guard";
import { CodeGenerator } from "../utils/code";
import { EmailSender } from "../utils/email";
import { Hasher } from "../utils/hasher";
import { FileStreamHelper } from '../utils/fileStreams';
import { UserRepo } from "../repositories/User.repo";
import { DatabaseConnection } from "../databaseConnection";
import { PermissionChecker } from "../infrastructure/PermissionChecker.infra";
import { EmailingTypeRepo } from "../repositories/EmailingType.repo";
import { Tokenizer } from "../utils/tokenizer";
import { RoleRepo } from "../repositories/Role.repo";
import { ErrorHandler } from "../utils/ErrorHandler";

export const usersRouter = Router()
const userController = new UserController(
    new UserFetchingModel(
        KnexConnection,
        new UserInfrastructure(),
        new UserGuard(),
        new CodeGenerator(),
        new EmailSender(),
        new Hasher(),
        new UserRepo(DatabaseConnection, 
            new EmailingTypeRepo(DatabaseConnection), 
            new Hasher(), 
            new PermissionChecker(), 
            new Tokenizer()),
        new PermissionChecker(),
        new RoleRepo(DatabaseConnection)
    ),
    new UserCSVService(
        KnexConnection,
        new RoleRepo(DatabaseConnection),
        new FileStreamHelper(),
        new UserRepo(DatabaseConnection, 
            new EmailingTypeRepo(DatabaseConnection), 
            new Hasher(), 
            new PermissionChecker(), 
            new Tokenizer()),
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
)

usersRouter.route('/')
    .get(authMiddleware.adminAuthMiddleware.bind(authMiddleware), 
        userController.getAllUsers.bind(userController))
    .post(userController.registerUser.bind(userController))

usersRouter.post('/login', userController.loginUser.bind(userController))

usersRouter.get('/personalArea', 
    authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
    userController.getPersonalArea.bind(userController))

usersRouter.get('/:idUser', 
    authMiddleware.adminAuthMiddleware.bind(authMiddleware),
    userController.getUser.bind(userController))

usersRouter.put("/edit/password",
    authMiddleware.basicAuthMiddleware.bind(authMiddleware),
    userController.changePassword.bind(userController)
)

usersRouter.put("/edit/personal", 
    authMiddleware.basicAuthMiddleware.bind(authMiddleware),
    userController.changePersonalInfo.bind(userController)
)

usersRouter.post('/restore/password', 
    userController.restorePasswordByEmail.bind(userController)
)

usersRouter.post('/restore/password/resendEmail', 
    userController.resendRestorationEmail.bind(userController)
)

usersRouter.post('/csv/create',
    authMiddleware.adminAuthMiddleware.bind(authMiddleware),
    userController.createUsersCSV.bind(userController)
)