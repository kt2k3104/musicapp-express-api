import { validationResult } from "express-validator";
import { songService } from "../services/song.service.js";
import uploadHelper from "../helpers/upload.helper.js";

export const songController = {
  getAllSong: async (req, res, next) => {
    const data = await songService.getAllSong();
    res.status(200).json({
      success: true,
      message: "Get all song success",
      result: data,
    });
  },

  getSongById: async (req, res, next) => {
    const data = await songService.getSongById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Get song by id success",
      result: data,
    });
  },

  addSong: async (req, res, next) => {
    const userId = req.userData.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      return next(error);
    }

    const data = await songService.addSong(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Create song success",
      result: data,
    });
  },

  editSong: async (req, res, next) => {
    const data = await songService.updateSong(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Update song success",
      result: data,
    });
  },

  deleteSong: async (req, res, next) => {
    const data = await songService.deleteSong(req.params.id, next);
    res.status(200).json({
      success: true,
      message: "Delete song success",
      result: data,
    });
  },

  uploadArtwork: async (req, res, next) => {
    const imgURL = await uploadHelper.uploadImage(req.files.artwork[0], next);
    res.status(200).json({
      success: true,
      message: "Upload artwork success",
      result: imgURL,
    });
  },

  uploadAudio: async (req, res, next) => {
    const { songURL, duration } = await uploadHelper.uploadAudio(
      req.files.song[0],
      next
    );
    res.status(200).json({
      success: true,
      message: "Upload audio success",
      result: {
        url: songURL,
        duration: Number(duration),
      },
    });
  },

  changeFavoriteStatus: async (req, res, next) => {
    const userId = req.userData.id;
    const data = await songService.changeFavoriteStatus(userId, req.params.id);
    res.status(200).json({
      success: true,
      message: "Change favorite status success",
      result: data,
    });
  },

  getSongByUserId: async (req, res, next) => {
    const data = await songService.getSongByUserId(req.params.id);
    res.status(200).json({
      success: true,
      message: "Get song by user id success",
      result: data,
    });
  },

  searchSong: async (req, res, next) => {
    console.log(req.query.keyword);
    const data = await songService.searchSong(req.query.keyword);
    res.status(200).json({
      success: true,
      message: "Search song success",
      result: data,
    });
  },
};
