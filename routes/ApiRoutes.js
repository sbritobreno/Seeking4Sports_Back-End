const router = require("express").Router();
const Api_Controller = require("../controllers/Api_Controller");

router.get("/sportslist", Api_Controller.getSportsList);
router.get("/cities", Api_Controller.getCities);

module.exports = router;
