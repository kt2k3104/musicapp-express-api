import { body } from "express-validator";

export const authValidation = {
  loginValidation: [body("email").notEmpty().isEmail(), body("password").notEmpty().isLength({ min: 6 })],
  registerValidation: [body("email").notEmpty().isEmail(), body("password").notEmpty().isLength({ min: 6 })],
  refreshTokenValidation: [body("refreshToken").notEmpty()],
};
