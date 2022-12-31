const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const Sport = require("./Sport");
const User = require("./User");

const Chat = db.define("Chat", {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.STRING,
    required: true,
  },
});

Chat.belongsTo(Sport);
Sport.hasOne(Chat);
Chat.hasOne(User);

module.exports = Chat;