import express from "express";
import { authController } from "../controller/auth.controller.js";
import { Validation } from "../validations/index.js";
const authRoute = express.Router();

const { login, refreshToken, register } = authController;
const { loginValidation, refreshTokenValidation, registerValidation } = Validation.authValidatgion;

// /api/auth/login
authRoute.post("/login", loginValidation, login);

// /api/auth/register
authRoute.post("/register", registerValidation, register);

// /api/auth/refresh_token
authRoute.post("/refresh", refreshTokenValidation, refreshToken);
export default authRoute;
