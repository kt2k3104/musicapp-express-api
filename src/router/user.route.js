import express from "express";
const userRoute = express.Router();

// /api/users
userRoute.get("", (req, res) => {
  res.json({ message: "get all users" });
});

export default userRoute;
