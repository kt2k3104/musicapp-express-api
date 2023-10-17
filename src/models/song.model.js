export const songSchema = (sequelize, DataTypes) => {
  const Song = sequelize.define("songs", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artwork: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Song;
};
