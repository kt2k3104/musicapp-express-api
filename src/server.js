import * as path from "path";
import express from "express";

import * as dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import appRoute from "./routes/index.js";
import db from "./models/index.js";
import multer from "multer";
import { v4 } from "uuid";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GGStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import passport from "passport";
import { Server } from "socket.io";
import { createServer } from "http";
import jwtHelper from "./helpers/jwt.helper.js";
import session from "express-session";

const __dirname = path.resolve();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 9001;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, v4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".mp3") {
    return cb(new Error("Only images and mp3 are allowed"));
  }
  cb(null, true);
};

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(
  multer({ storage: fileStorage, fileFilter }).fields([
    { name: "avatar", maxCount: 1 },
    { name: "artwork", maxCount: 1 },
    { name: "song", maxCount: 1 },
  ])
);

app.use(
  session({
    secret: "secretcucmanh",
    cookie: { maxAge: 60000 },
  })
);
app.use(passport.session());

// passport
const jwtPassportOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};
const jwtStrategy = new JWTStrategy(
  jwtPassportOptions,
  async (payload, done) => {
    try {
      if (payload) {
        return done(null, payload);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
);
passport.use(jwtStrategy);

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIEND_ID,
  clientSecret: process.env.GOOGLE_CLIEND_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};
const googleStrategy = new GGStrategy(
  googleStrategyOptions,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userData = {
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value,
      };

      const user = await db.User.findOne({
        where: {
          email: userData.email,
        },
      });

      if (!user) {
        let newUser = await db.User.create({
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email: profile.emails[0].value,
          password: "google",
          avatar: profile.photos[0].value,
          account_type: "google",
        });
        newUser = newUser.get({ plain: true });
        return done(null, { id: newUser.id, email: newUser.email });
      }
      if (user.avatar !== userData.avatar) {
        await db.User.update(
          { avatar: userData.avatar },
          {
            where: {
              email: userData.email,
            },
          }
        );
      }

      return done(null, { id: user.id, email: user.email });
    } catch (error) {
      return done(error, false);
    }
  }
);
passport.use(googleStrategy);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "name", "photos", "displayName", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const userData = {
          email: `${profile.id}@gmail.com`,
          name: profile.displayName,
          avatar: profile.photos[0].value,
        };

        const user = await db.User.findOne({
          where: {
            email: userData.email,
          },
        });

        if (!user) {
          let newUser = await db.User.create({
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            email: `${profile.id}@gmail.com`,
            password: "facebook",
            avatar: profile.photos[0].value,
            account_type: "facebook",
          });
          newUser = newUser.get({ plain: true });
          return cb(null, { id: newUser.id, email: newUser.email });
        }
        if (user.avatar !== userData.avatar) {
          await db.User.update(
            { avatar: userData.avatar },
            {
              where: {
                email: userData.email,
              },
            }
          );
        }

        return cb(null, { id: user.id, email: user.email });
      } catch (error) {
        return cb(error, false);
      }
    }
  )
);

// router
app.use("/api", appRoute);

app.use((error, req, res, next) => {
  if (error.res) {
    return res.status(error.res.statusCode).json(error.res);
  }
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  res.status(statusCode).json({
    statusCode: statusCode,
    message: message,
  });
});

app.use("*", (req, res, next) => {
  res.status(404).json({
    message: "Page not found 404!!!",
  });
});

// connect websocket

global._io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  connectionStateRecovery: {},
});
global._io.on("connection", async (socket) => {
  const authHeader = socket.handshake.headers.authorization;
  if (authHeader && authHeader.split(" ")[1] !== "null") {
    try {
      const payload = await jwtHelper.verifyToken(
        authHeader.split(" ")[1],
        process.env.JWT_SECRET_KEY
      );
      socket.join(payload.email);
      console.log("created room for " + payload.email);
    } catch (error) {
      console.log(error);
      socket.disconnect(true);
    }
  } else {
    socket.disconnect(true);
  }
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// start server
httpServer.listen(PORT, () => {
  console.log("server started at http://localhost:" + PORT);
});
