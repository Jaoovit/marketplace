const express = require("express");
const adsController = require("../controllers/adsController");
const router = express.Router();
const verifyToken = require("../config/token");

// Get
router.get("/advertisements", adsController.getAllAds);
router.get("/advertisement/:id", adsController.getAdById);

module.exports = router;
