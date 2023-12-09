const { validationResult } = require('express-validator'); // to validate the created document
const User = require('../models/user.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');


exports.getAllUsers = asyncWrapper(async (req, res, next) => {
  const limit = req.query.limit * 1 || 10;
  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * limit;

  const users = await User.find(
    {},
    {
      __v: false,
    }
  )
    .limit(limit)
    .skip(skip);

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

exports.register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create('user already exists', 400, 'fail');
    return next(error);
  }

  // password hashing
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });
  // generate JWT token
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  await newUser.save();

  res.status(201).json({
    status: 'success',
    data: newUser,
  });
});

exports.login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = appError.create(
      'email and password are required',
      400,
      'fail'
    );
    return next(error);
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    const error = appError.create('user not found', 400, 'fail');
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    // logged in successfully
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    return res.status(200).json({
      status: 'success',
      data: { token },
    });
  } else {
    const error = appError.create('incorrect email or password', 400, 'fail');
    return next(error);
  }
});
