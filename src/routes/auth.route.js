import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { Validation } from "../validations/index.js";
import passport from "passport";
const authRoute = express.Router();

const {
  login,
  refreshToken,
  register,
  googleLogin,
  googleLoginRedirect,
  facebookLogin,
  facebookLoginRedirect,
} = authController;
const { loginValidation, refreshTokenValidation, registerValidation } =
  Validation.authValidation;

// /api/auth/register
authRoute.post("/register", registerValidation, register);

// /api/auth/login
authRoute.post("/login", loginValidation, login);

// /api/auth/refresh_token
authRoute.post("/refresh-token", refreshTokenValidation, refreshToken);
export default authRoute;

// /api/auth/google/login
authRoute.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  googleLogin
);

// /api/auth/google/login/redirect
authRoute.get(
  "/google/login/redirect",
  passport.authenticate("google", {
    failureRedirect: ["/songs"],
    session: false,
  }),
  googleLoginRedirect
);

// /api/auth/facebook/login
authRoute.get(
  "/facebook/login",
  passport.authenticate("facebook"),
  facebookLogin
);

// /api/auth/facebook/login/redirect
authRoute.get(
  "/facebook/login/redirect",
  passport.authenticate("facebook", {
    failureRedirect: ["/songs"],
    session: false,
  }),
  facebookLoginRedirect
);
