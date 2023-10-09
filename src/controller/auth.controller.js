import { validationResult } from "express-validator";
import { authService } from "../service/auth.service.js";

export const authController = {
  login: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      return next(error);
    }

    const data = authService.login(req.body);
    res.json(data);
  },
  register: async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      return next(error);
    }

    const data = await authService.register(req.body);

    res.json(data);
  },
  refreshToken: (req, res, next) => {
    const data = authService.refreshToken();
    res.json(data);
  },
};
