const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

require('./db/mongodb');
const winston = require('./helpers/winston');

const usersRouter = require('./routes/users');

const app = express();

// // view engine setup
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Request-Headers',
    'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'PUT, PATCH, POST, GET, DELETE, OPTIONS'
  );
  //res.header("Accept-Encoding", "gzip, compress, br")
  next();
});

app.use('/api/user', usersRouter);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/index.html"));
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('uncaughtException', function (err) {
  winston.error(
    `${new Date().toUTCString() + ' uncaughtException:'} -  ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
  process.exit(1);
});

process.on('uncaughtRejection', function (err) {
  winston.error(
    `${new Date().toUTCString() + ' uncaughtRejection:'} -  ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );

  process.exit(1);
});

module.exports = app;
