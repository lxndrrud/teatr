import { UserController } from "../controllers/users";
import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth";
import { UserFetchingModel } from "../services/users";
import { UserDatabaseModel } from "../dbModels/users";
import { RoleFetchingModel } from "../services/roles";
import { RoleDatabaseModel } from "../dbModels/roles";

export const usersRouter = Router()
const userController = new UserController(new UserFetchingModel(
    new UserDatabaseModel(), 
    new RoleFetchingModel(new RoleDatabaseModel())
))

usersRouter.route('/')
    .get(basicAuthMiddleware, userController.getAllUsers.bind(userController))
    .post(userController.registerUser.bind(userController))
usersRouter.post('/login', userController.loginUser.bind(userController))
usersRouter.post('/adminLogin', userController.loginAdmin.bind(userController))