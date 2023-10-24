import jwtHelper from "../helpers/jwt.helper.js";
import { authService } from "../services/auth.service.js";
import dotenv from "dotenv";
dotenv.config();

export const authController = {
  register: async (req, res, next) => {
    try {
      const data = await authService.register(req.body, next);
      res.status(201).json({
        message: "create user success.",
        user: data.user,
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const data = await authService.login(req.body, next);
      res.status(200).json({
        success: true,
        message: "Login success",
        result: {
          tokens: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          },
          id: data.id,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  googleLogin: async (req, res, next) => {
    res.status(200).json({
      message: "authenticate",
    });
  },
  googleLoginRedirect: async (req, res, next) => {
    console.log(req.user);

    // create token

    const { access_token, refresh_token } = jwtHelper.generateToken(
      {
        id: req.user.id,
        email: req.user.email,
      },
      process.env.JWT_SECRET_KEY,
      process.env.JWT_ACCESS_TOKEN_EXPIRES,
      process.env.JWT_REFRESH_TOKEN_EXPIRES
    );

    res.redirect(
      `https://zingmp3-khaitd.vercel.app/oauth/redirect?access_token=${access_token}&refresh_token=${refresh_token}`
    );
  },
  refreshToken: async (req, res, next) => {
    try {
      const data = await authService.refreshToken(req.body);

      res.status(200).json({
        success: true,
        result: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
