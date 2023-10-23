import { renameKeys } from "../helpers/renameKeys.helper.js";
import db from "../models/index.js";

export const playlistService = {
  getAllPlaylist: async (userId) => {
    const playlists = await db.Playlist.findAll({
      where: { userId },
      include: [
        {
          model: db.Song,
          as: "playlist_songs",
          attributes: { exclude: ["userId", "playlist_songs_song"] },
        },
      ],
      attributes: { exclude: ["userId"] },
    });

    return playlists.map((playlist) => {
      return renameKeys(playlist.dataValues, {
        playlist_songs: "songs",
      });
    });
  },

  getPlaylistById: async (id, userId) => {
    const playlists = await db.Playlist.findOne({
      where: { id, userId },
      include: [{ model: db.Song, as: "playlist_songs" }],
    });
    const newPlaylists = renameKeys(playlists.dataValues, {
      playlist_songs: "songs",
    });
    return newPlaylists;
  },

  createPlaylist: async (body, userId) => {
    const data = { ...body, userId };
    const playlist = await db.Playlist.create(data);
    return await db.Playlist.findOne({
      where: { id: playlist.id },
      include: [{ model: db.User, as: "user_playlists" }],
    });
  },

  updatePlaylist: async (id, data) => {
    return await db.Playlist.update(data, { where: { id } });
  },

  deletePlaylist: async (id) => {
    return await db.Playlist.destroy({ where: { id } });
  },

  addSongToPlaylist: async (playlistId, songId) => {
    const data = await db.PlaylistSongsSong.findOne({
      where: { playlistId, songId },
    });
    if (data !== null) {
      return { message: "Song already exists in playlist" };
    }
    await db.PlaylistSongsSong.create({ playlistId, songId });
    const playlist = await db.Playlist.findOne({
      where: { id: playlistId },
      include: [{ model: db.Song, as: "playlist_songs" }],
    });
    return renameKeys(playlist.dataValues, {
      playlist_songs: "songs",
    });
  },

  removeSongFromPlaylist: async (playlistId, songId) => {
    await db.PlaylistSongsSong.destroy({
      where: { playlistId, songId },
    });
    const playlist = await db.Playlist.findOne({
      where: { id: playlistId },
      include: [{ model: db.Song, as: "playlist_songs" }],
    });
    console.log(playlist);
    return renameKeys(playlist.dataValues, {
      playlist_songs: "songs",
    });
  },
};
