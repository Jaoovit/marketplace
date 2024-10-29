const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");
const router = express.Router();
const verifyToken = require("../config/token");

const upload = multer({ storage: multer.memoryStorage() });

// Post
router.post(
  "/register",
  upload.single("profileImage"),
  userController.registerUser
);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

// Put
router.put("/description", verifyToken, userController.updateDescription);
router.put(
  "/profileImage",
  verifyToken,
  upload.single("profileImage"),
  userController.updateProfileImage
);
router.put("/location", verifyToken, userController.updateLocation);

module.exports = router;
