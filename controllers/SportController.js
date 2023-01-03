const Sport = require("../models/Sport");
const User = require("../models/User");
const Members = require("../models/Members");
const default_sport_img = "../public/images/sport_img_default.png";
const sequelize = require("sequelize");

// helpers
const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");

module.exports = class SportController {
  // create a new activity
  static async createNewActivity(req, res) {
    const sport = req.body.sport;
    const group_name = req.body.group_name;
    const date = req.body.date;
    const time = req.body.time;
    const location = req.body.location;
    const image = req.files;
    const total_players = Number(req.body.total_players);
    const description = req.body.description;

    // validations
    if (!sport) {
      res.status(422).json({ message: "Sport name is needed!" });
      return;
    }

    if (!group_name) {
      res.status(422).json({ message: "Group name is needed!" });
      return;
    }

    if (!date) {
      res.status(422).json({ message: "Date is needed!" });
      return;
    }

    if (!time) {
      res.status(422).json({ message: "Time is needed!" });
      return;
    }

    if (!location) {
      res.status(422).json({ message: "Location is needed!" });
      return;
    }

    if (!total_players) {
      res.status(422).json({ message: "Number of total players is needed!" });
      return;
    }

    if (!description) {
      res.status(422).json({ message: "Description is needed!" });
      return;
    }

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    // create activity
    const activity = {
      image: image,
      sport: sport,
      group_name: group_name,
      date: date,
      time: time,
      location: location,
      total_players: total_players,
      description: description,
      UserId: user.id,
    };

    if (!activity.image) {
      activity.image = default_sport_img;
    }

    try {
      const s = await Sport.create(activity);
      await Members.create({ SportId: s.id, UserId: user.id });

      res.status(201).json({
        message: "New Activity created successfully!",
        newActivity: activity,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // get all registered activities
  static async getAll(req, res) {
    const sports = await Sport.findAll({
      include: User,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      sports: sports,
    });
  }

  // get all user activities
  static async getMyActivities(req, res) {
    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    const sports = await Sport.findAll({
      include: User,
      where: {id: { [sequelize.Op.in]: sequelize.literal(`(SELECT sportId FROM members WHERE userId = ${user.id})`),
    }}
    });

    res.status(200).json({
      sports,
    });
  }
};
