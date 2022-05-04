import { UserController } from "../controllers/users";
import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth";
import { UserFetchingModel } from "../fetchingModels/users";
import { UserDatabaseModel } from "../dbModels/users";
import { RoleFetchingModel } from "../fetchingModels/roles";
import { RoleDatabaseModel } from "../dbModels/roles";

export const usersRouter = Router()
const userController = new UserController(new UserFetchingModel(
    new UserDatabaseModel(), 
    new RoleFetchingModel(new RoleDatabaseModel())))

usersRouter.route('/')
    .get(basicAuthMiddleware, userController.getAllUsers)
    .post(userController.registerUser)
usersRouter.post('/login', userController.loginUser)