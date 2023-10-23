import express from "express";
import { userController } from "../controllers/user.controller.js";
import isAuth from "../middlewares/AuthMiddleware.js";

const notiRoute = express.Router();
const { getNotifications } = userController;

notiRoute.get("/", isAuth, getNotifications);

export default notiRoute;
