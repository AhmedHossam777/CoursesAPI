const express = require('express');

const router = express.Router();

const courseControllers = require('../controllers/courses.controller');

const validationMiddleware = require('../middlewares/validationSchema');

const verifyToken = require('../middlewares/verifyToken');

const allowedTo = require('../middlewares/allowedTo');

router
  .route('/')
  .get(courseControllers.getAllCourses)
  .post(
    verifyToken,
    validationMiddleware.validationSchema,
    allowedTo('MANAGER'),
    courseControllers.addCourse
  );

router
  .route('/:courseId')
  .get(courseControllers.getCourse)
  .patch(courseControllers.updateCourse)
  .delete(
    verifyToken,
    allowedTo('ADMIN', 'MANAGER'),
    courseControllers.deleteCourse
  );

module.exports = router;
