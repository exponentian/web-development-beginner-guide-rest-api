const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const { MONGODB_URI, API } = require('./config');

const indexRouter = require('./app/routes/index');
const usersRouter = require('./app/routes/users');
const authorsRouter = require('./app/routes/authors');
const booksRouter = require('./app/routes/books');
const genresRouter = require('./app/routes/genres');
const bookinstancesRouter = require('./app/routes/bookinstances');


// connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(connection => console.log('Successfully connected to MongoDB'))
  .catch(error => console.log(error.message));


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


// Routers
app.use('/', indexRouter);
app.use(API + '/users', usersRouter);
app.use(API + '/catalog', authorsRouter);
app.use(API + '/catalog', booksRouter);
app.use(API + '/catalog', genresRouter);
app.use(API + '/catalog', bookinstancesRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
