import db from "../models/index.js";

export const authService = {
  // create service with controller
  login: (body) => {
    return {
      message: "login",
      data: body,
    };
  },
  register: async (body) => {
    const { email, password } = body;

    const user = await db.User.create({
      email,
      password,
    });

    return {
      user: user,
    };
  },
  refreshToken: () => {
    return {
      message: "refresh_token",
    };
  },
};
