import { UserController } from "../controllers/users";
import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth";
import { UserFetchingModel } from "../services/users/UsersCRUD.service";
import { UserCSVService } from '../services/users/UsersCSV.service'
import { UserDatabaseModel } from "../dbModels/users";
import { RoleFetchingModel } from "../services/roles";
import { RoleDatabaseModel } from "../dbModels/roles";
import { UserInfrastructure } from "../infrastructure/User.infra"
import { KnexConnection } from "../knex/connections";
import { UserGuard } from "../guards/User.guard";
import { CodeGenerator } from "../utils/code";
import { EmailSender } from "../utils/email";
import { Hasher } from "../utils/hasher";
import { FileStreamHelper } from '../utils/fileStreams';

export const usersRouter = Router()
const userController = new UserController(
    new UserFetchingModel(
        KnexConnection,
        new UserDatabaseModel(KnexConnection), 
        new RoleFetchingModel(new RoleDatabaseModel(KnexConnection)),
        new UserInfrastructure(new UserDatabaseModel(KnexConnection)),
        new UserGuard(),
        new CodeGenerator(),
        new EmailSender(),
        new Hasher()
    ),
    new UserCSVService(
        KnexConnection,
        new UserDatabaseModel(KnexConnection), 
        new RoleFetchingModel(new RoleDatabaseModel(KnexConnection)),
        new FileStreamHelper(),
        new Hasher()
    )
)

const authMiddleware = new AuthMiddleware(
    new UserInfrastructure(new UserDatabaseModel(KnexConnection))
)

usersRouter.route('/')
    .get(authMiddleware.staffAuthMiddleware.bind(authMiddleware), 
        userController.getAllUsers.bind(userController))
    .post(userController.registerUser.bind(userController))

usersRouter.post('/login', userController.loginUser.bind(userController))

usersRouter.post('/adminLogin', userController.loginAdmin.bind(userController))

usersRouter.get('/personalArea', 
    authMiddleware.basicAuthMiddleware.bind(authMiddleware), 
    userController.getPersonalArea.bind(userController))

usersRouter.get('/:idUser', 
    authMiddleware.staffAuthMiddleware.bind(authMiddleware),
    userController.getUser.bind(userController))

usersRouter.post("/edit/password",
    authMiddleware.basicAuthMiddleware.bind(authMiddleware),
    userController.changePassword.bind(userController)
)

usersRouter.post("/edit/personal", 
    authMiddleware.basicAuthMiddleware.bind(authMiddleware),
    userController.changePersonalInfo.bind(userController)
)

usersRouter.post('/restore/password', 
    userController.restorePasswordByEmail.bind(userController)
)

usersRouter.post('/csv/create',
    authMiddleware.staffAuthMiddleware.bind(authMiddleware),
    userController.createUsersCSV.bind(userController)
)