import * as path from "path";
import express from "express";

import * as dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import appRoute from "./router/index.js";
import db from "./models/index.js";

const __dirname = path.resolve();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 9001;

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// router
app.use("/api", appRoute);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  const data = error.data || [];
  res.status(statusCode).json({
    message: message,
    data: data,
  });
});

app.use("*", (req, res, next) => {
  res.status(404).json({
    message: "Page not found 404!!!",
  });
});

// start server
app.listen(PORT, () => {
  console.log("server started at http://localhost:" + PORT);
});
