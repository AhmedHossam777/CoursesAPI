const { validationResult } = require('express-validator'); // to validate the created document
const Course = require('../models/course.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');

exports.getAllCourses = asyncWrapper(async (req, res, next) => {
  // get all courses from database using Course model

  const limit = req.query.limit * 1 || 10;
  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find(
    {},
    {
      __v: false,
    }
  )
    .limit(limit)
    .skip(skip);

  res.status(200).json({
    status: 'success',
    data: { courses },
  });
});

exports.getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create('not found course', 404, 'fail');
    return next(error);
  }
  return res.status(200).json({
    status: 'success',
    data: { course },
  });
});

exports.addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, 'fail');
    return next(error);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();

  res.status(201).json({
    status: 'success',
    data: newCourse,
  });
});

exports.updateCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCourse) {
    const error = appError.create('course not found!', 404, 'fai;');
    return next(error);
  }

  res.status(200).json({
    status: 'success',
    data: updatedCourse,
  });
});

exports.deleteCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;

  await Course.findByIdAndDelete(courseId);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
