import { body, validationResult } from "express-validator";

export const authValidation = {
  loginValidation: [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isLength({ min: 6 }),
    async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 400;
        error.data = errors.array();
        return next(error);
      }

      next();
    },
  ],
  registerValidation: [
    body("email").notEmpty().isEmail(),
    body("password").notEmpty().isLength({ min: 6 }),
    async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 400;
        error.data = errors.array();
        return next(error);
      }

      next();
    },
  ],
  refreshTokenValidation: [body("refreshToken").notEmpty()],
};
