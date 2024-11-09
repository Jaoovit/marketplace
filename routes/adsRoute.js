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
router.get("/user/:id/advertisements", adsController.getAdsByUser);

// Post
router.post(
  "/advertisement/:id",
  //verifyToken,
  upload.array("images"),
  adsController.postAd
);

// Put
router.put(
  "/advertisement/title/:id/:userId",
  verifyToken,
  adsController.updateAdTitle
);
router.put(
  "/advertisement/description/:id/:userId",
  verifyToken,
  adsController.updateAdDescription
);

// Delete
router.delete(
  "/advertisement/:id/:userId",
  verifyToken,
  adsController.deleteAdById
);
router.delete(
  "/advertisements/:userId",
  verifyToken,
  adsController.deleteAdByUser
);

module.exports = router;
