const express = require('express');

const router = express.Router();

const userControllers = require('../controllers/users.controller');

const verifyToken = require('../middlewares/verifyToken');

const multer = require('multer');

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('file: ', file);
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: diskStorage });

// get all user
// register
// login

router.route('/').get(verifyToken, userControllers.getAllUsers);

router
  .route('/register')
  .post(upload.single('avatar'), userControllers.register);

router.route('/login').post(userControllers.login);

module.exports = router;
