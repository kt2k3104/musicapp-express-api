import { validationResult } from "express-validator";
import { userService } from "../services/user.service.js";
import uploadHelper from "../helpers/upload.helper.js";

export const userController = {
  getAllUser: async (req, res, next) => {
    console.log(req.user);
    // const userId = req.userData.id;
    // const data = await userService.getAllUser(userId);
    res.status(200).json({
      success: true,
      // result: { data: data, total: data.length },
    });
  },
  getUserById: async (req, res, next) => {
    const data = await userService.getUserById(req.params.id);
    res.status(200).json({
      success: true,
      result: data,
    });
  },
  updateUser: async (req, res, next) => {
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
  },
  deleteUser: async (req, res, next) => {
    const data = await userService.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: "Delete user success",
      result: data,
    });
  },

  uploadAvatar: async (req, res, next) => {
    const userId = req.userData.id;
    const imgURL = await uploadHelper.uploadImage(req.files.avatar[0], next);
    const data = await userService.uploadAvatar(imgURL, userId, next);
    res.status(200).json({
      success: true,
      message: "Upload avatar success",
      result: data,
    });
  },

  getCurrentUser: async (req, res, next) => {
    const userId = req.userData.id;
    const data = await userService.getCurrentUser(userId);
    res.status(200).json({
      success: true,
      message: "Get current user success",
      result: data,
    });
  },
  getNotifications: async (req, res, next) => {
    const data = await userService.getNotifications();
    res.status(200).json({
      success: true,
      message: "Get notifications success",
      result: data,
    });
  },
};
