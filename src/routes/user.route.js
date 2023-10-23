import express from "express";
import { userController } from "../controllers/user.controller.js";
import isAuth from "../middlewares/AuthMiddleware.js";
import passport from "passport";
const userRoute = express.Router();

const {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  uploadAvatar,
  getCurrentUser,
} = userController;

// /api/users
userRoute.get("", passport.authenticate("jwt", { session: false }), getAllUser);

// /api/users/:id
userRoute.get("/:id", isAuth, getUserById);

// /api/users/:id
userRoute.put("/:id", isAuth, updateUser);

// /api/users/:id
userRoute.delete("/:id", isAuth, deleteUser);

// /api/users/upload-avt
userRoute.post("/upload-avt", isAuth, uploadAvatar);

// /api/users/curr/info
userRoute.get("/curr/info", isAuth, getCurrentUser);

export default userRoute;
