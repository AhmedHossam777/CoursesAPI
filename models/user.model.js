const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, 'field must be a valid email address'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'MANAGER'],
    default: 'USER',
  },
  avatar: {
    type : String,
    default: './../uploads/profile.png'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
