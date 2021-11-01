const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const utils = require('./utils');


// ------------ routers --------------------
const step12Router = require('./routes/step12');
const loginRouter = require('./routes/login');

// create app
//----------------------------------------------------------------------------------------
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//----------------------------------------------------------------------------------------


// please pay attention to the pipeline oredr, the auth only function come after the login....
//----------------------------------------------------------------------------------------
app.use('/api/login',loginRouter);
// the auth midelware
app.use(utils.authVerify)
app.use('/api/step12',step12Router);
//----------------------------------------------------------------------------------------



// catch 404 and forward to error handler
//----------------------------------------------------------------------------------------
app.use(function(req, res, next) {
  next(createError(404));
});
//----------------------------------------------------------------------------------------


// error handler
//----------------------------------------------------------------------------------------
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // return the err
  res.status(err.status || 500).send(err.message);
});
//----------------------------------------------------------------------------------------


module.exports = app;
