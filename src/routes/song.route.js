import express from "express";
import { songController } from "../controllers/song.controller.js";
import isAuth from "../middlewares/AuthMiddleware.js";
const songRoute = express.Router();

const {
  getAllSong,
  getSongById,
  addSong,
  editSong,
  deleteSong,
  uploadArtwork,
  uploadAudio,
  changeFavoriteStatus,
  getSongByUserId,
  searchSong,
} = songController;

// /api/songs
songRoute.get("", getAllSong);

// /api/songs/search?keyword=...
songRoute.get("/search", searchSong);

// /api/songs/:id
songRoute.get("/:id", isAuth, getSongById);

// /api/songs
songRoute.post("", isAuth, addSong);

// /api/songs/:id
songRoute.put("/:id", isAuth, editSong);

// /api/songs/:id
songRoute.delete("/:id", isAuth, deleteSong);

// /api/songs/upload-art
songRoute.post("/upload-art", isAuth, uploadArtwork);

// /api/songs/upload-audio
songRoute.post("/upload-audio", isAuth, uploadAudio);

// /api/songs/favorite/:id
songRoute.get("/favorite/:id", isAuth, changeFavoriteStatus);

// /api/songs/user/:id
songRoute.get("/user/:id", isAuth, getSongByUserId);

export default songRoute;
