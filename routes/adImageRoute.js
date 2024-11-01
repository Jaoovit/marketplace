const express = require("express");
const multer = require("multer");
const adImageController = require("../controllers/adImageController");
const router = express.Router();
const verifyToken = require("../config/token");

const upload = multer({ storage: multer.memoryStorage() });

// Put
router.put(
  "/advertisement/image/:id",
  verifyToken,
  upload.single("image"),
  adImageController.updateImageById
);

// Delete
router.delete(
  "/advertisement/image/:id",
  verifyToken,
  adImageController.deleteImageById
);

module.exports = router;