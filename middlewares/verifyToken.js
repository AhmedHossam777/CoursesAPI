const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');

const verifyToken = async (req, res, next) => {
  const authHeader =
    req.headers['Authorization'] || req.headers['authorization'];

  if (!authHeader) {
    return next(appError.create('token is required', 401, 'fail'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = decodedToken;
    next();
  } catch (err) {
    return next(appError.create('token is invalid', 401, 'Error'));
  }
};

module.exports = verifyToken;
