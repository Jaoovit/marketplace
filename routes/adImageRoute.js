const express = require("express");
const multer = require("multer");
const adImageController = require("../controllers/adImageController");
const router = express.Router();
const verifyToken = require("../config/token");

const upload = multer({ storage: multer.memoryStorage() });

// Post
router.post(
  "/advertisement/:id/images/:userId",
  verifyToken,
  upload.single("image"),
  adImageController.addImagetoAd
);

// Put
router.put(
  "/advertisement/image/:id/:userId",
  verifyToken,
  upload.single("image"),
  adImageController.updateImageById
);

// Delete
router.delete(
  "/advertisement/image/:id/:userId",
  verifyToken,
  adImageController.deleteImageById
);

module.exports = router;
