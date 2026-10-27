const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
  const isCsv = path.extname(file.originalname).toLowerCase() === ".csv";
  if (!isCsv) return cb(new Error("Only .csv files are allowed"));
  cb(null, true);
};

module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
