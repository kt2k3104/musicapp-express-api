export const userSchema = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "user",
    },
    account_type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "local",
    },
  });
  return User;
};
