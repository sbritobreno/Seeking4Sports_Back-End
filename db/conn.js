require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "seeking4sports",
  "root",
  process.env.DB_PASSWORD,
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

module.exports = sequelize;
