export const userFavoriteSongsSongSchema = (sequelize) => {
  const UserFavoriteSongsSong = sequelize.define("user_favorite_songs_song");
  return UserFavoriteSongsSong;
};
