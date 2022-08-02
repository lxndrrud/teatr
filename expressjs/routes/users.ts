import { UserController } from "../controllers/users";
import { Router } from "express";
import { basicAuthMiddleware, staffAuthMiddleware } from "../middlewares/auth";
import { UserFetchingModel } from "../services/users";
import { UserDatabaseModel } from "../dbModels/users";
import { RoleFetchingModel } from "../services/roles";
import { RoleDatabaseModel } from "../dbModels/roles";
import { UserInfrastructure } from "../infrastructure/User.infra"
import { KnexConnection } from "../knex/connections";
import { UserGuard } from "../guards/User.guard";

export const usersRouter = Router()
const userController = new UserController(
    new UserFetchingModel(
        KnexConnection,
        new UserDatabaseModel(KnexConnection), 
        new RoleFetchingModel(new RoleDatabaseModel(KnexConnection)),
        new UserInfrastructure(new UserDatabaseModel(KnexConnection)),
        new UserGuard()
    )
)

usersRouter.route('/')
    .get(staffAuthMiddleware, userController.getAllUsers.bind(userController))
    .post(userController.registerUser.bind(userController))

usersRouter.post('/login', userController.loginUser.bind(userController))

usersRouter.post('/adminLogin', userController.loginAdmin.bind(userController))

usersRouter.get('/personalArea', 
    basicAuthMiddleware, 
    userController.getPersonalArea.bind(userController))

usersRouter.get('/:idUser', 
    staffAuthMiddleware,
    userController.getUser.bind(userController))

usersRouter.post("/edit/password",
    basicAuthMiddleware,
    userController.changePassword.bind(userController)
)

usersRouter.post("/edit/personal", 
    basicAuthMiddleware,
    userController.changePersonalInfo.bind(userController)
)