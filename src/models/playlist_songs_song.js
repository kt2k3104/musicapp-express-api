export const playlistSongsSongSchema = (sequelize) => {
  const PlaylistSongsSong = sequelize.define("playlist_songs_song");
  return PlaylistSongsSong;
};
