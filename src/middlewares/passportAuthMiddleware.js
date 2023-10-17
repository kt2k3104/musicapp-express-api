import passport from "passport";

const passportMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

export default passportMiddleware;
