import { Sequelize, DataTypes } from "sequelize";
import { useSchema } from "./user.model.js";
const sequelize = new Sequelize("musicappdb", "root", "khai2003", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  logging: false,
  operatorsAliases: false,
});

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

db.User = useSchema(sequelize, DataTypes);

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

const createManyToManyRelation = function (model1, model2, modelRelation) {
  model1.belongsToMany(model2, { through: modelRelation });

  model2.belongsToMany(model1, { through: modelRelation });
};

db.sequelize.sync({ alter: true }).then(() => {
  console.log("re-sync database done.");
});

export default db;
