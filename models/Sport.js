const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const User = require("./User");
const Members = require("./Members");
const Chat = require("./Chat");

const Sport = db.define("Sport", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING,
    required: true,
  },
  sport: {
    type: DataTypes.STRING,
    required: true,
  },
  group_name: {
    type: DataTypes.STRING,
    required: true,
  },
  date: {
    type: DataTypes.STRING,
    required: true,
  },
  time: {
    type: DataTypes.STRING,
    required: true,
  },
  location: {
    type: DataTypes.STRING,
    required: true,
  },
  total_players: {
    type: DataTypes.SMALLINT,
    required: true,
  },
  description: {
    type: DataTypes.STRING,
    required: true,
  },
});

Sport.belongsToMany(User, { through: Members });
User.belongsToMany(Sport, { through: Members });
Sport.belongsTo(User);
Sport.hasOne(Chat);

module.exports = Sport;
