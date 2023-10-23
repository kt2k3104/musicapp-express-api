import authRoute from "./auth.route.js";

import express from "express";
import userRoute from "./user.route.js";
import songRoute from "./song.route.js";
import playlistRoute from "./playlist.route.js";
import notiRoute from "./noti.route.js";

const appRoute = express();

// /api/auth
appRoute.use("/auth", authRoute);

// /api/users
appRoute.use("/users", userRoute);

// /api/notifications
appRoute.use("/notifications", notiRoute);

// /api/songs
appRoute.use("/songs", songRoute);

// /api/playlists
appRoute.use("/playlists", playlistRoute);

export default appRoute;
