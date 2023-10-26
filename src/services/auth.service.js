import db from "../models/index.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import jwtHelper from "../helpers/jwt.helper.js";

export const authService = {
  // create service with controller
  register: async (body, next) => {
    const { email, password, first_name, last_name } = body;

    const userExist = await db.User.findOne({
      where: {
        email: email,
      },
    });

    if (userExist) {
      const err = new Error("User already exist.");
      err.statusCode = 400;
      return next(err);
    }

    const bcryptPassword = await bcrypt.hash(password, 12);

    const user = await db.User.create({
      first_name,
      last_name,
      email,
      password: bcryptPassword,
    });

    user.password = "";

    return {
      user: user,
    };
  },
  login: async (body, next) => {
    try {
      const { email, password } = body;
      const user = await db.User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        return next(error);
      }
      const isPasswordEqual = await bcrypt.compare(password, user.password);
      if (!isPasswordEqual) {
        const error = new Error("Password is not correct.");
        error.statusCode = 401;
        return next(error);
      }

      const { access_token, refresh_token } = jwtHelper.generateToken(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY,
        process.env.JWT_ACCESS_TOKEN_EXPIRES,
        process.env.JWT_REFRESH_TOKEN_EXPIRES
      );

      // save refresh token to database
      await user.update({
        refresh_token: refresh_token,
      });

      return {
        access_token,
        refresh_token,
        id: user.id,
      };
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return next(error);
    }
  },
  googleLoginRedirect: async (id, refresh_token) => {
    const user = await db.User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      return error;
    }

    await user.update({
      refresh_token: refresh_token,
    });
  },
  refreshToken: async (body) => {
    const user = await db.User.findOne({
      where: {
        refresh_token: body.refresh_token,
      },
    });
    if (!user.refresh_token) {
      const error = new Error("refresh token not found.");
      error.statusCode = 401;
      return error;
    }

    const { access_token, refresh_token } = jwtHelper.generateToken(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      process.env.JWT_ACCESS_TOKEN_EXPIRES,
      process.env.JWT_REFRESH_TOKEN_EXPIRES
    );

    // update refresh token to database
    await user.update({
      refresh_token: refresh_token,
    });
    return {
      access_token,
      refresh_token,
    };
  },
};
