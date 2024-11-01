const express = require("express");
const multer = require("multer");
const adImageController = require("../controllers/adImageController");
const router = express.Router();
const verifyToken = require("../config/token");

const upload = multer({ storage: multer.memoryStorage() });

// Delete
router.delete("/adImage/:id", adImageController.deleteImageById);

module.exports = router;
