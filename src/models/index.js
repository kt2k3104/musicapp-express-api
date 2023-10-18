import { Sequelize, DataTypes } from "sequelize";
import { userSchema } from "./user.model.js";
import { songSchema } from "./song.model.js";
import { playlistSchema } from "./playlist.model.js";
import { notificationSchema } from "./notification.modal.js";
import { userFavoriteSongsSongSchema } from "./user_favorite_songs_song.js";
import { playlistSongsSongSchema } from "./playlist_songs_song.js";

import dotenv from "dotenv";
dotenv.config(); // su dung bien env trong file .env

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    port: process.env.DATABASE_PORT,
    logging: false,
    operatorsAliases: false,
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log("connect to database successfully");
  })
  .catch((err) => {
    console.log("unable to connect to database", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = userSchema(sequelize, DataTypes);
db.Song = songSchema(sequelize, DataTypes);
db.Playlist = playlistSchema(sequelize, DataTypes);
db.Notification = notificationSchema(sequelize, DataTypes);
db.UserFavoriteSongsSong = userFavoriteSongsSongSchema(sequelize);
db.PlaylistSongsSong = playlistSongsSongSchema(sequelize);

const createOneToManyRelation = function (manyModel, oneModel, foreignKey, as) {
  oneModel.hasMany(manyModel, {
    foreignKey: foreignKey,
    as: as,
  });

  manyModel.belongsTo(oneModel, {
    foreignKey: foreignKey,
    as: as,
  });
};

const createOneToOneRelation = function (model1, model2, foreignKey, as) {
  model1.hasOne(model2, {
    foreignKey: foreignKey,
    as: as,
  });

  model2.belongsTo(model1, {
    foreignKey: foreignKey,
    as: as,
  });
};

const createManyToManyRelation = function (
  model1,
  model2,
  modelRelation,
  as1,
  as2
) {
  model1.belongsToMany(model2, { through: modelRelation, as: as1 });
  model2.belongsToMany(model1, { through: modelRelation, as: as2 });
};

createOneToManyRelation(db.Song, db.User, "userId", "user_songs");
createOneToManyRelation(db.Playlist, db.User, "userId", "user_playlists");
createOneToManyRelation(
  db.Notification,
  db.User,
  "userId",
  "user_notifications"
);

createManyToManyRelation(
  db.Song,
  db.User,
  "user_favorite_songs_song",
  "songFavorite_user",
  "user_songFavorite"
);
createManyToManyRelation(
  db.Song,
  db.Playlist,
  "playlist_songs_song",
  "song_playlists",
  "playlist_songs"
);

db.sequelize.sync({ alter: true }).then(() => {
  console.log("re-sync database done.");
});

export default db;
