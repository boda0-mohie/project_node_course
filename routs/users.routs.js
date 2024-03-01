const express = require("express");

const multer = require("multer");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cd) {
    console.log("FILE", file);
    cd(null, "uploads");
  },
  filename: function (req, file, cd) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cd(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("This File Not Availabe", 400), false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

const router = express.Router();

const usersControlers = require("../controlers/users.controlers");

const verifyToken = require("../middleware/verifyToken");
const appError = require("../utilities/appError");

router.route("/").get(verifyToken, usersControlers.getUsers);

router
  .route("/register")
  .post(upload.single("avatar"), usersControlers.register);

router.route("/login").post(usersControlers.login);

module.exports = router;
