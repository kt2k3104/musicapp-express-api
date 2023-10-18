import express from "express";
import { playlistController } from "../controllers/playlist.controller.js";
import isAuth from "../middlewares/AuthMiddleware.js";
const playlistRoute = express.Router();

const {
  getAllPlaylist,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = playlistController;

// /api/playlists
playlistRoute.get("", isAuth, getAllPlaylist);

// /api/playlists/:id
playlistRoute.get("/:id", isAuth, getPlaylistById);

// /api/playlists
playlistRoute.post("", isAuth, createPlaylist);

// /api/playlists/:id
playlistRoute.put("/:id", isAuth, updatePlaylist);

// /api/playlists/:id
playlistRoute.delete("/:id", isAuth, deletePlaylist);

// /api/playlists/add
playlistRoute.patch("/add", isAuth, addSongToPlaylist);

// /api/playlists/remove
playlistRoute.patch("/remove", isAuth, removeSongFromPlaylist);

export default playlistRoute;
