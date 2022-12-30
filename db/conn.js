require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "seeking4sports",
  "root",
  "root123",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

try {
  sequelize.authenticate();
  console.log("Connected to mySQL!");
} catch (err) {
  console.log(`Connection Failed: ${err}`);
}

sequelize.sync()

module.exports = sequelize;
