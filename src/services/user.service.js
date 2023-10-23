import db from "../models/index.js";
import uploadHelper from "../helpers/upload.helper.js";
import { renameKeys } from "../helpers/renameKeys.helper.js";

export const userService = {
  getAllUser: async (userId) => {
    const currentUser = await db.User.findOne({
      where: {
        id: userId,
      },
      attributes: { exclude: ["password", "refresh_token"] },
    });
    if (currentUser.role !== "admin") {
      return "You are not admin";
    }
    const data = await db.User.findAll();
    return data;
  },
  getUserById: async (id) => {
    const user = await db.User.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["password", "refresh_token"] },
      // attributes: ["email", "first_name", "last_name", "avatar", "role"],
      include: [
        {
          model: db.Song,
          as: "user_songs",
        },
        {
          model: db.Song,
          as: "user_songFavorite",
          attributes: { exclude: ["userId", "user_favorite_songs_song"] },
        },
      ],
    });
    if (!user) {
      return "User not found";
    }
    const newUser = renameKeys(user.dataValues, {
      user_songs: "songs",
      user_songFavorite: "favoriteSongs",
    });

    return newUser;
  },
  updateUser: async (id, body) => {
    const { first_name, last_name, email } = body;
    const data = await db.User.update(
      {
        first_name,
        last_name,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return data;
  },
  deleteUser: async (id) => {
    const data = await db.User.destroy({
      where: {
        id: id,
      },
    });
    return data;
  },
  uploadAvatar: async (imgURL, userId, next) => {
    const { avatar } = await db.User.findOne({
      where: {
        id: userId,
      },
      attributes: ["avatar"],
    });

    if (avatar) {
      const publicId =
        "music-app-expressjs/images" +
        avatar.split("music-app-expressjs/images")[1].split(".")[0];
      await uploadHelper.deleteImage(publicId, next);
    }
    const data = await db.User.update(
      {
        avatar: imgURL,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    return data;
  },
  getCurrentUser: async (userId) => {
    const user = await db.User.findOne({
      where: {
        id: userId,
      },
      attributes: { exclude: ["password", "refresh_token"] },
      include: [
        {
          model: db.Song,
          as: "user_songs",
        },
        {
          model: db.Song,
          as: "user_songFavorite",
          attributes: { exclude: ["userId", "user_favorite_songs_song"] },
        },
      ],
    });
    const newUser = renameKeys(user.dataValues, {
      user_songs: "songs",
      user_songFavorite: "favoriteSongs",
    });

    return newUser;
  },
  getNotifications: async (userId) => {
    const data = await db.Notification.findAll({
      where: {
        userId,
      },
    });
    return data.map((item) =>
      renameKeys(item.dataValues, { createdAt: "created_at" })
    );
  },
};
