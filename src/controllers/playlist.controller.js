import { validationResult } from "express-validator";
import { playlistService } from "../services/playlist.service.js";

export const playlistController = {
  getAllPlaylist: async (req, res, next) => {
    const userId = req.userData.id;
    const data = await playlistService.getAllPlaylist(userId);
    res.status(200).json({
      success: true,
      message: "Get all playlist success",
      result: data,
    });
  },

  getPlaylistById: async (req, res, next) => {
    const userId = req.userData.id;
    const data = await playlistService.getPlaylistById(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Get playlist by id success",
      result: data,
    });
  },

  createPlaylist: async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      return next(error);
    }

    const userId = req.userData.id;
    const data = await playlistService.createPlaylist(req.body, userId);
    res.status(200).json({
      success: true,
      message: "Create playlist success",
      result: data,
    });
  },

  updatePlaylist: async (req, res, next) => {
    const data = await playlistService.updatePlaylist(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Update playlist success",
      result: data,
    });
  },

  deletePlaylist: async (req, res, next) => {
    const data = await playlistService.deletePlaylist(req.params.id);
    res.status(200).json({
      success: true,
      message: "Delete playlist success",
      result: data,
    });
  },

  addSongToPlaylist: async (req, res, next) => {
    const playlistId = Number(req.body.playlistId);
    const songId = Number(req.body.songId);
    const data = await playlistService.addSongToPlaylist(playlistId, songId);
    res.status(200).json({
      success: true,
      message: "Add song to playlist success",
      result: data,
    });
  },

  removeSongFromPlaylist: async (req, res, next) => {
    const playlistId = Number(req.body.playlistId);
    const songId = Number(req.body.songId);
    const data = await playlistService.removeSongFromPlaylist(
      playlistId,
      songId
    );
    res.status(200).json({
      success: true,
      message: "Remove song from playlist success",
      result: data,
    });
  },
};
