const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");
const router = express.Router();
const verifyToken = require("../config/token");

const upload = multer({ storage: multer.memoryStorage() });

// Get
router.get("/users", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);

// Post
router.post(
  "/register",
  upload.single("profileImage"),
  userController.registerUser
);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

// Put
router.put(
  "/description/:userId",
  verifyToken,
  userController.updateUserDescription
);
router.put(
  "/profileImage/:userId",
  verifyToken,
  upload.single("profileImage"),
  userController.updateUserProfileImage
);
router.put("/location/:userId", verifyToken, userController.updateUserLocation);

module.exports = router;
