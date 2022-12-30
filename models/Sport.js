const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const User = require("./User");

const Sport = db.define("Sport", {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
//   host: {
//     type: DataTypes.STRING,
//     required: true,
//   },
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
  members: {
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

Sport.belongsTo(User);
User.hasMany(Sport);

module.exports = Sport;
