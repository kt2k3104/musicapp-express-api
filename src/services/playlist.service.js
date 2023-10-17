import db from "../models/index.js";

export const playlistService = {
  getAllPlaylist: async () => {
    return await db.Playlist.findAll({
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "avatar"],
        },
      ],
    });
  },

  getPlaylistById: async (id) => {
    return await db.Playlist.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "avatar"],
        },
      ],
    });
  },

  createPlaylist: async (data) => {
    return await db.Playlist.create(data);
  },

  updatePlaylist: async (id, data) => {
    return await db.Playlist.update(data, { where: { id } });
  },

  deletePlaylist: async (id) => {
    return await db.Playlist.destroy({ where: { id } });
  },

  addSongToPlaylist: async (data) => {
    const { playlistId, songId } = data;
    const playlist = await db.Playlist.findOne({ where: { id: playlistId } });
    const song = await db.Song.findOne({ where: { id: songId } });
    return await playlist.addSong(song);
  },

  removeSongFromPlaylist: async (data) => {
    const { playlistId, songId } = data;
    const playlist = await db.Playlist.findOne({ where: { id: playlistId } });
    const song = await db.Song.findOne({ where: { id: songId } });
    return await playlist.removeSong(song);
  },
};
