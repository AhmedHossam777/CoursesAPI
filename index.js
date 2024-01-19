const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');


const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const url = process.env.MONGO_URL;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    w: 'majority',
  })
  .then(() => {
    console.log('Mongodb server started!');
  });

// Allow requests from your front-end
app.use(
  cors({
    origin: 'http://127.0.0.1:8080', // replace with your front-end's URL
  })
);

app.set('trust proxy', 1); // trust first proxy
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes 
  max: 100 // limit each IP to 100 requests per windowMs
}));

app.use(helmet());  // set security headers
app.use(xss()); // clean user input from malicious html code
app.use(cors()); // enable cors for all requests

const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/user.route');

app.use(express.json());

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

// global middleware for not found routes
app.all('*', (req, res, next) => {
  res.status(400).json({
    status: 'fail',
    message: 'This resource Not found!',
  });
});

// global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: 'fail',
    message: err.message,
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log('app listening on port 4000!');
});
