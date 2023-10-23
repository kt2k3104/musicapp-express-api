import dotenv from "dotenv";
dotenv.config();
import jwtHelper from "../helpers/jwt.helper.js";

const isAuth = async (req, res, next) => {
  const accessTokenSecret = process.env.JWT_SECRET_KEY;
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const tokenFromClient = authHeader.split(" ")[1];
    try {
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );
      req.userData = decoded;
      next();
    } catch (error) {
      if (error.toString() === "TokenExpiredError: jwt expired") {
        const err = new Error("token expired");
        err.res = {
          statusCode: 419,
          message: "token expired",
        };
        next(err);
      }
      const err = new Error("invalid token");
      err.statusCode = 401;
      next(err);
    }
  } else {
    return res.status(419).send({
      statusCode: 419,
      message: "token expired",
    });
  }
};

export default isAuth;
