import { Op } from "sequelize";
import uploadHelper from "../helpers/upload.helper.js";
import db from "../models/index.js";

export const songService = {
  getAllSong: async () => {
    const allSong = await db.Song.findAll({
      include: [
        {
          model: db.User,
          as: "user_songs",
          attributes: { exclude: ["password", "refresh_token"] },
        },
      ],
    });
    allSong.forEach((song) => {
      song.dataValues.user = song.dataValues.user_songs;
      delete song.dataValues.userId;
      delete song.dataValues.user_songs;
    });
    return allSong;
  },

  getSongById: async (id) => {
    const song = await db.Song.findOne({ where: { id } });
    if (!song) {
      const error = new Error("Song not found.");
      error.statusCode = 404;
      return next(error);
    }
    return await db.Song.findOne({
      where: { id },
    });
  },

  addSong: async (userId, data) => {
    return await db.Song.create({
      ...data,
      userId,
    });
  },

  editSong: async (id, data) => {
    const song = await db.Song.findOne({ where: { id } });
    if (!song) {
      const error = new Error("Song not found.");
      error.statusCode = 404;
      return next(error);
    }
    return await db.Song.update(data, { where: { id } });
  },

  deleteSong: async (id, next) => {
    const song = await db.Song.findOne({ where: { id } });
    if (!song) {
      const error = new Error("Song not found.");
      error.statusCode = 404;
      return next(error);
    }
    const idArtwork =
      "music-app-expressjs/images" +
      song.avatar.split("music-app-expressjs/images")[1].split(".")[0];
    uploadHelper.deleteImage(idArtwork, next);
    const idSongUrl =
      "music-app-expressjs/audios" +
      song.url.split("music-app-expressjs/audios")[1].split(".")[0];
    uploadHelper.deleteAudio(idSongUrl, next);
    return await db.Song.destroy({ where: { id } });
  },

  changeFavoriteStatus: async (userId, songId) => {
    const favorite = await db.UserFavoriteSongsSong.findOne({
      where: { userId, songId },
    });

    if (!favorite) {
      return await db.UserFavoriteSongsSong.create({
        userId,
        songId,
      });
    } else {
      return await db.UserFavoriteSongsSong.destroy({
        where: { userId, songId },
      });
    }
  },

  getSongByUserId: async (id) => {
    return await db.Song.findAll({ where: { userId: id } });
  },

  searchSong: async (keyword) => {
    return await db.Song.findAll({
      where: { name: { [Op.like]: `%${keyword}%` } },
      limit: 5,
    });
  },
};
