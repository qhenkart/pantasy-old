var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejs = require('ejs');


var passport = require('passport');
var MongoClient = require('mongodb').MongoClient
var MongoDBStore = require('connect-mongodb-session')(session);
var client = require('./server/config/mongo');



var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var url = 'mongodb://localhost:27017/pantasy';

//establishes a Session store with MongoDB, this creates persistant sessions
// var store = new MongoDBStore({
//   uri: 'mongodb://localhost/pantasy',
//   collection: 'mySessions'
// });

// error handling for session store
// store.on('error', function(error) {
//   console.log('ERROR IN STORE: ', error);
// });

// pass passport for authentication configuration
require('./server/config/passport.js')(passport);



// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

//passport Oauth session configuration
app.use(session({
  secret: 'keyboard cat',
    //these cookies will last one week
  maxAge: 1000 * 60 * 60 * 24 * 7,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  // store: store
}));

// Initializes Passport
app.use(passport.initialize());
app.use(passport.session());



app.use('/', routes);
app.use('/users', users);

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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
