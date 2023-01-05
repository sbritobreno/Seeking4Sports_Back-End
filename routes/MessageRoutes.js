const router = require("express").Router();
const MessageController = require("../controllers/MessageController");

// middlewares
const verifyToken = require("../helpers/verify-token");

router.get("/sport/:sport_id", verifyToken, MessageController.getMessages);
router.post("/new/sport/:sport_id", verifyToken, MessageController.newMessage);

module.exports = router;
