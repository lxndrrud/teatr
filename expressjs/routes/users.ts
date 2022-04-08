import { registerUser, loginUser, getAllUsers } from "../controllers/users";
import { Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth";

export const usersRouter = Router()

usersRouter.route('/')
    .get(basicAuthMiddleware, getAllUsers)
    .post(registerUser)
usersRouter.post('/login', loginUser)