const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const User = require("./User");
const Sport = require("./Sport");

const Members = db.define("Members", {
    SportId: {
      type: DataTypes.INTEGER,
      references: {
        model: Sport,
        key: 'id'
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    }
  }, { timestamps: false });

module.exports = Members;
