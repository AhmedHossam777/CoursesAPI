const { body, validationResult } = require('express-validator');

exports.validationSchema = [
  // middleware validators
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .isLength({ min: 2 })
    .withMessage('title should be at least 2 characters'),

  body('price').notEmpty().withMessage('price is required'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        message: errors.array(),
      });
    }

    next();
  },
];
