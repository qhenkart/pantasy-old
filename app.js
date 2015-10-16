var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var config = require('./config.json');
var client = require('./server/config/mongo');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var qt = require('quickthumb');



// var MongoClient = require('mongodb').MongoClient
// var MongoDBStore = require('connect-mongodb-session')(session);



var routes = require('./server/routes/index');
var pants = require('./server/routes/pants');

var app = express();


// pass passport for authentication configuration
require('./server/config/passport.js')(passport);


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(qt.static(__dirname + '/'));
   
// passport Oauth session configuration
app.use(session({
    //these cookies will last one week
  maxAge: 1000 * 60 * 60 * 24 * 7,
  secret: 'foo',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ "db": config.mongo.name,
    "host": config.mongo.host,
    "port": config.mongo.port,
    "username": config.mongo.username, 
    "password": config.mongo.password,
  })
}));

// Initializes Passport
app.use(passport.initialize());
app.use(passport.session());



app.use('/', routes(passport));
app.use('/p', pants(passport));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error('error', "msg: ",err.message, "error: ",err)
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error('error', "msg: ",err.message, "error: ",err)
  res.json({
    message: err.message,
    error: err
  });
});



module.exports = app;
