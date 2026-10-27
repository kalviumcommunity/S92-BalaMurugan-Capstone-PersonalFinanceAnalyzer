const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { uploadTransactions } = require("../controllers/uploadController");

const router = express.Router();

router.post(
  "/",
  protect,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  uploadTransactions
);

module.exports = router;
