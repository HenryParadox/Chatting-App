const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },
  filename: (req, file, cb) => {
    const date = Date.now();
    const filename =
      file.fieldname + "_" + date + path.extname(file.originalname);
    req.filename = filename;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png & .jpg file allowed"));
    }
  },
  limits: { fileSize: 1000000 * 1 },
});

module.exports = upload;
