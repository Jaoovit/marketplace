const express = require("express");
const multer = require("multer");
const adsController = require("../controllers/adsController");
const router = express.Router();
const verifyToken = require("../config/token");

const upload = multer({ storage: multer.memoryStorage() });

// Get
router.get("/advertisements", adsController.getAllAds);
router.get("/advertisement/:id", adsController.getAdById);
router.get("/search", adsController.searchAds);
router.get("/user/advertisements", verifyToken, adsController.getAdsByUser);

// Post
router.post(
  "/advertisement",
  verifyToken,
  upload.array("images"),
  adsController.postAd
);

// Delete
router.delete("/advertisement/:adId", verifyToken, adsController.deleteAdById);
router.delete("/advertisements", verifyToken, adsController.deleteAdByUser);

module.exports = router;
