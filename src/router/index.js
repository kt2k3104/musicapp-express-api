import authRoute from "./auth.route.js";

import express from "express";
import userRoute from "./user.route.js";

const appRoute = express();

// /api/auth
appRoute.use("/auth", authRoute);

// /api/users
appRoute.use("/users", userRoute);

export default appRoute;
