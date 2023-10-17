export const notificationSchema = (sequelize, DataTypes) => {
  const Notification = sequelize.define("notifications", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Notification;
};
