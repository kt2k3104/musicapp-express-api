import { validationResult } from "express-validator";
import { songService } from "../services/song.service.js";
import uploadHelper from "../helpers/upload.helper.js";

export const songController = {
  getAllSong: async (req, res, next) => {
    try {
      const data = await songService.getAllSong();
      res.status(200).json({
        success: true,
        message: "Get all song success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },

  getSongById: async (req, res, next) => {
    try {
      const data = await songService.getSongById(req.params.id);
      res.status(200).json({
        success: true,
        message: "Get song by id success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },

  addSong: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  editSong: async (req, res, next) => {
    try {
      const data = await songService.updateSong(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Update song success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteSong: async (req, res, next) => {
    try {
      const data = await songService.deleteSong(req.params.id, next);
      res.status(200).json({
        success: true,
        message: "Delete song success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },

  uploadArtwork: async (req, res, next) => {
    try {
      const imgURL = await uploadHelper.uploadImage(req.files.artwork[0], next);
      res.status(200).json({
        success: true,
        message: "Upload artwork success",
        result: imgURL,
      });
    } catch (error) {
      next(error);
    }
  },

  uploadAudio: async (req, res, next) => {
    try {
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
    } catch (error) {
      next(error);
    }
  },

  changeFavoriteStatus: async (req, res, next) => {
    try {
      const userId = req.userData.id;
      const data = await songService.changeFavoriteStatus(
        userId,
        req.params.id
      );
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  getSongByUserId: async (req, res, next) => {
    try {
      const data = await songService.getSongByUserId(req.params.id);
      res.status(200).json({
        success: true,
        message: "Get song by user id success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },

  searchSong: async (req, res, next) => {
    try {
      const data = await songService.searchSong(req.query.keyword);
      res.status(200).json({
        success: true,
        message: "Search song success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
