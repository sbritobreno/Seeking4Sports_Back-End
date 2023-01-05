const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const User = require("./User");
const Sport = require("./Sport");

const Message = db.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: DataTypes.STRING,
    required: true,
  },
  SportId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Sports',
      key: 'id'
    }
  },
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
});

module.exports = Message;
