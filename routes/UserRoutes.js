const router = require("express").Router();
const UserController = require("../controllers/UserController");

// middleware
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.patch(
  "/edit",
  verifyToken,
  imageUpload.single("image"),
  UserController.editUser
);
router.delete(
  "/deleteaccount",
  verifyToken,
  UserController.deleteUserAccount
);
router.patch(
  "/resetpassword",
  UserController.resetUserPassword
);

module.exports = router;
