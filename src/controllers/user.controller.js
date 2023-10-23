import { validationResult } from "express-validator";
import { userService } from "../services/user.service.js";
import uploadHelper from "../helpers/upload.helper.js";

export const userController = {
  getAllUser: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const data = await userService.getAllUser(userId);
      res.status(200).json({
        success: true,
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },
  getUserById: async (req, res, next) => {
    try {
      const data = await userService.getUserById(req.params.id);
      res.status(200).json({
        success: true,
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 400;
        error.data = errors.array();
        return next(error);
      }

      const data = await userService.updateUser(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Update user success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const data = await userService.deleteUser(req.params.id);
      res.status(200).json({
        success: true,
        message: "Delete user success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },

  uploadAvatar: async (req, res, next) => {
    try {
      const userId = req.userData.id;
      const imgURL = await uploadHelper.uploadImage(req.files.avatar[0], next);
      const data = await userService.uploadAvatar(imgURL, userId, next);
      res.status(200).json({
        success: true,
        message: "Upload avatar success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      const userId = req.userData.id;
      const data = await userService.getCurrentUser(userId);
      res.status(200).json({
        success: true,
        message: "Get current user success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },
  getNotifications: async (req, res, next) => {
    try {
      const userId = req.userData.id;
      const data = await userService.getNotifications(userId);
      res.status(200).json({
        success: true,
        message: "Get notifications success",
        result: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
