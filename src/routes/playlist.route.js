import express from "express";
import { playlistController } from "../controllers/playlist.controller.js";
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
playlistRoute.get("", getAllPlaylist);

// /api/playlists/:id
playlistRoute.get("/:id", getPlaylistById);

// /api/playlists
playlistRoute.post("", createPlaylist);

// /api/playlists/:id
playlistRoute.put("/:id", updatePlaylist);

// /api/playlists/:id
playlistRoute.delete("/:id", deletePlaylist);

// /api/playlists/add
playlistRoute.get("/add", addSongToPlaylist);

// /api/playlists/remove
playlistRoute.get("/remove", removeSongFromPlaylist);

export default playlistRoute;
