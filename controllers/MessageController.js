const sequelize = require("sequelize");
const Members = require("../models/Members");
const Message = require("../models/Message");
const Sport = require("../models/Sport");

// helpers
const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");

module.exports = class MessageController {
  static async getMessages(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    const sport_id = req.params.sport_id;

    const activity = await Sport.findOne({where: {id: sport_id}})

    if (!activity) {
      res.status(422).json({
        message:
          "Activity not found!",
      });
      return;
    }

    // check if user is a member
    const isMember = await Members.findOne({
      where: {
        [sequelize.Op.and]: [{ SportId: sport_id }, { UserId: user.id }],
      },
    });

    if (!isMember) {
      res.status(422).json({
        message:
          "User is not a member so you cannot access this activity chat!",
      });
      return;
    }

    try {
      // get messages from an activity
      const group_chat = await Message.findAll({
        where: { SportId: sport_id },
        order: [["createdAt", "DESC"]],
      });
      res.json({
        message: "Chat from the activity loaded!",
        data: group_chat,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async newMessage(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    const sport_id = req.params.sport_id;
    const text = req.body.message_text;

    const activity = await Sport.findOne({where: {id: sport_id}})

    if (!activity) {
      res.status(422).json({
        message:
          "Activity not found!",
      });
      return;
    }

    // check if user is a member
    const isMember = await Members.findOne({
      where: {
        [sequelize.Op.and]: [{ SportId: sport_id }, { UserId: user.id }],
      },
    });

    if (!isMember) {
      res
        .status(422)
        .json({ message: "Only members can send messages to this activity!" });
      return;
    }

    // check if new message is null
    if (!text) {
      res.status(422).json({ message: "You need to type something!" });
      return;
    }

    const new_message = { message: text, SportId: sport_id, UserId: user.id };

    try {
      // add new message
      const data = await Message.create(new_message);
      res.json({
        message: "New message sent!",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};
