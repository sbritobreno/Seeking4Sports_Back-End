const db = require("../db/conn");

const Members = db.define("Members", {}, { timestamps: false });

module.exports = Members;
