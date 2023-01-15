const router = require("express").Router();
const SportController = require("../controllers/SportController");

// middlewares
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post(
  "/newactivity",
  verifyToken,
  imageUpload.single("image"),
  SportController.createNewActivity
);
router.get("/", SportController.getAll);
router.get("/myactivities", verifyToken, SportController.getMyActivities);
router.get("/:id", SportController.getSportById);
router.delete("/delete/:id", verifyToken, SportController.removeSportById);
router.patch("/edit/:id", verifyToken, imageUpload.single("image"), SportController.editActivity);
router.delete("/leavegroup/:id", verifyToken, SportController.leaveActivity);
router.post("/joingroup/:id", verifyToken, SportController.joinActivity);
router.delete(
  "/:sport_id/removemember/:member_id",
  verifyToken,
  SportController.removeMember
);
router.get("/:id/admin", SportController.getAdmin);
router.get("/:id/members", SportController.getMembers);

module.exports = router;
