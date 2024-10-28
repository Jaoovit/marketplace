const express = require("express");
const adsController = require("../controllers/adsController");
const router = express.Router();
const verifyToken = require("../config/token");

// Get
router.get("/advertisements", adsController.getAllAds);

module.exports = router;
