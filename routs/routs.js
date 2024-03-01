const express = require("express");

const router = express.Router();


const { validationSchema } = require("../middleware/validationSchema");

const controlers = require("../controlers/courses.controler");

const verifyToken = require("../middleware/verifyToken");
const userRoles = require("../utilities/users.roles");
const allowedTo = require("../middleware/allowedTo");

router
  .route("/")
  .get(controlers.getCourses)
  .post(
    verifyToken,
    allowedTo(userRoles.MANGER),
    validationSchema(),
    controlers.craetCourse
  );

router
  .route("/:courseId")
  .get(controlers.getCourse)
  .patch(controlers.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANGER),
    controlers.deleteCourse
  );

module.exports = router;
