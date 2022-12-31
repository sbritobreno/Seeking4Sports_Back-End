const router = require("express").Router();
const Api_Controller = require("../controllers/Api_Controller");

router.get("/weekdays", Api_Controller.getWeekdays);
router.get("/sportslist", Api_Controller.getSportsList);

module.exports = router;
