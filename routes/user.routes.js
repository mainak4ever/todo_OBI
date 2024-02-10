const express = require("express");
const { userController } = require("../controllers");
const { auth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/register").post(userController.registerUser);
router.route("/login").post(userController.loginUser);
router.route("/logout").post(auth, userController.logoutUser);
router.route("/refresh-access-token").post(userController.refreshAccessToken);

module.exports = router;
