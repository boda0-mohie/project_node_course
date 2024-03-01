const { validationResult } = require("express-validator"); // body => Is A MiddelWare
const Course = require("../models/models.courses");
const { courses } = require("../data/courses");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utilities/appError");

const getCourses = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: "success", data: courses });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create("Not Found Course", 404, "fail");
    return next(error);
  }
  return res.json({ status: "success", data: { course } });
});

const craetCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, "fail");
    return next(error);
  }

  const newCourse = new Course(req.body);

  await newCourse.save();

  res.status(201).json({ status: "success", data: newCourse });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;

  const updateCourse = await Course.updateOne(
    { _id: courseId },
    { $set: { ...req.body } }
  );
  return res.status(201).json({ status: "success", data: updateCourse });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const data = await Course.deleteOne({ _id: req.params.courseId });

  res.status(200).json({ status: "success", data: null });
});

module.exports = {
  getCourses,
  getCourse,
  craetCourse,
  deleteCourse,
  updateCourse,
};
