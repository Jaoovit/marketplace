const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const verifyToken = require("../config/token");

// Post
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

// Put
router.put("/description", verifyToken, userController.updateDescription);
router.put("/profileImage", verifyToken, userController.updateProfileImage);
router.put("/location", verifyToken, userController.updateLocation);

module.exports = router;
