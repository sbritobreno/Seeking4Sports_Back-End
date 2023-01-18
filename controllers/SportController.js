const Sport = require("../models/Sport");
const User = require("../models/User");
const Members = require("../models/Members");
const Message = require("../models/Message");
const default_sport_img = "sport_img_default.png";
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
    const total_players = Number(req.body.total_players);
    const missing_players = total_players - 1; // 1 == the user who is creating the activity
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

    if (!total_players || total_players < 2) {
      res.status(422).json({
        message:
          "Number of total players is needed and has to be greater than 1!",
      });
      return;
    }

    if (!description) {
      res.status(422).json({ message: "Description is needed!" });
      return;
    }

    let img = "";
    if (req.file) {
      img = req.file.filename;
    } else {
      img = default_sport_img;
    }

    // get user
    const token = getToken(req);
    const user = await getUserByToken(token);

    // create activity
    const activity = {
      image: img,
      sport: sport,
      group_name: group_name,
      date: date,
      time: time,
      location: location,
      total_players: total_players,
      missing_players: missing_players,
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

    // Update number of missing players
    sports.map((s) => SportController.updateNumberOfMembers(s.id));

    res.status(200).json({
      sports: sports,
    });
  }

  // get all user activities
  static async getMyActivities(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const sports = await Sport.findAll({
      include: User,
      where: {
        id: {
          [sequelize.Op.in]: sequelize.literal(
            `(SELECT sportId FROM members WHERE userId = ${user.id})`
          ),
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      sports,
    });
  }

  // get a specific activity
  static async getSportById(req, res) {
    const id = req.params.id;

    // check if activity exists
    const activity = await Sport.findOne({ include: User, where: { id: id } });

    if (!activity) {
      res.status(404).json({ message: "Activity not found!" });
      return;
    }

    res.status(200).json({
      activity: activity,
    });
  }

  // remove an activity
  static async removeSportById(req, res) {
    const id = req.params.id;

    // check if activity exists
    const activity = await Sport.findOne({ where: { id: id } });

    if (!activity) {
      res.status(404).json({ message: "Activity not found!" });
      return;
    }

    // check if user is the admin
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (activity.UserId != user.id) {
      res.status(500).json({
        message: "It can only be deleted by the Admin!",
      });
      return;
    }

    await Message.destroy({ where: { SportId: id } });
    await Sport.destroy({ where: { id: id } });

    res.status(200).json({ message: "Activity deleted!" });
  }

  static async editActivity(req, res) {
    const id = req.params.id;

    // check if activity exists
    const activity = await Sport.findOne({ where: { id: id } });

    if (!activity) {
      res.status(404).json({ message: "Activity not found!" });
      return;
    }

    const sport = req.body.sport;
    const group_name = req.body.group_name;
    const date = req.body.date;
    const time = req.body.time;
    const location = req.body.location;
    const total_players = Number(req.body.total_players);
    const description = req.body.description;

    if (req.file) {
      activity.image = req.file.filename;
    }

    // validations
    if (!sport) {
      res.status(422).json({ message: "Sport name is needed!" });
      return;
    }
    activity.sport = sport;

    if (!group_name) {
      res.status(422).json({ message: "Group name is needed!" });
      return;
    }
    activity.group_name = group_name;

    if (!date) {
      res.status(422).json({ message: "Date is needed!" });
      return;
    }
    activity.date = date;

    if (!time) {
      res.status(422).json({ message: "Time is needed!" });
      return;
    }
    activity.time = time;

    if (!location) {
      res.status(422).json({ message: "Location is needed!" });
      return;
    }
    activity.location = location;

    if (!total_players || total_players < 2) {
      res.status(422).json({
        message:
          "Number of total players is needed and has to be greater than 1!",
      });
      return;
    }
    activity.total_players = total_players;

    if (!description) {
      res.status(422).json({ message: "Description is needed!" });
      return;
    }
    activity.description = description;

    try {
      await activity.save();
      SportController.updateNumberOfMembers(activity.id);
      res.json({
        message: "Activity details updated!",
        data: activity,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async leaveActivity(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    const id = req.params.id;

    // check if user is a member
    const isMember = await Members.findOne({
      where: {
        [sequelize.Op.and]: [{ SportId: id }, { UserId: user.id }],
      },
    });

    if (!isMember) {
      res.status(422).json({ message: "User is not a member!" });
      return;
    }

    const activity = await Sport.findOne({ where: { id: id } });
    if (!activity) {
      res.status(422).json({ message: "Activity does not exist!" });
      return;
    }

    activity.missing_players++;
    await activity.save();

    try {
      // remove user from the activity
      await Members.destroy({
        where: {
          [sequelize.Op.and]: [{ SportId: id }, { UserId: user.id }],
        },
      });
      res.json({
        message: "You left the group!",
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async joinActivity(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    const id = req.params.id;

    // check if user is a member
    const isMember = await Members.findOne({
      where: {
        [sequelize.Op.and]: [{ SportId: id }, { UserId: user.id }],
      },
    });

    if (isMember) {
      res.status(422).json({ message: "User is a member already!" });
      return;
    }

    const activity = await Sport.findOne({ where: { id: id } });
    if (!activity) {
      res.status(422).json({ message: "Activity does not exist!" });
      return;
    }

    const new_member = { SportId: id, UserId: user.id };

    activity.missing_players--;
    await activity.save();

    try {
      // add user to the activity
      await Members.create(new_member);
      res.json({
        message: "You joined the group!",
        data: new_member,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async removeMember(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    const sport_id = req.params.sport_id;
    const member_id = req.params.member_id;

    const activity = await Sport.findOne({ where: { id: sport_id } });
    if (!activity) {
      res.status(422).json({ message: "Activity does not exist!" });
      return;
    }

    // check if user is admin
    const isAdmin = await Sport.findOne({
      where: {
        [sequelize.Op.and]: [{ id: sport_id }, { UserId: user.id }],
      },
    });

    if (!isAdmin) {
      res.status(422).json({ message: "Only the admin can remove members!" });
      return;
    }

    // check if user to be removed is a member
    const isMember = await Members.findOne({
      where: {
        [sequelize.Op.and]: [{ SportId: sport_id }, { UserId: member_id }],
      },
    });

    if (!isMember) {
      res
        .status(422)
        .json({ message: "the user to be removed is not a member!" });
      return;
    }

    activity.missing_players++;
    await activity.save();

    try {
      // delete user from the activity
      await Members.destroy({
        where: {
          [sequelize.Op.and]: [{ SportId: sport_id }, { UserId: member_id }],
        },
      });
      res.json({
        message: "Member removed from the group!",
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getAdmin(req, res) {
    const id = req.params.id;

    const activity = await Sport.findOne({ where: { id: id } });

    if (!activity) {
      res.status(404).json({ mesage: "Activity not found!" });
      return;
    }

    try {
      const admin = await User.findOne({ where: { id: activity.UserId } });
      res.json({
        message: "Group admin loaded!",
        admin: admin,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getMembers(req, res) {
    const id = req.params.id;
    const members = [];

    const activity = await Sport.findOne({ where: { id: id } });

    if (!activity) {
      res.status(404).json({ mesage: "Activity not found!" });
      return;
    }

    const groupMembers = await Members.findAll({
      where: { SportId: activity.id },
    });

    await Promise.all(
      groupMembers.map(async (member) => {
        const user = await User.findOne({ where: { id: member.UserId } });
        members.push(user);
      })
    );

    try {
      res.json({
        message: "Group members loaded!",
        members: members,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async updateNumberOfMembers(id) {
    const activity = await Sport.findOne({ where: { id: id } });
    const totalMembers = await Members.findAll({
      where: { SportId: id },
    });

    activity.missing_players = activity.total_players - totalMembers.length;
    if (activity.missing_players < 0) {
      activity.missing_players = 0;
    }
    activity.save();
  }
};
