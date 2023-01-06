const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const Members = db.define(
  "Members",
  {
    SportId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Sports",
        key: "id",
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  { timestamps: false }
);

module.exports = Members;
