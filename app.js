const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = express.Router();
const jwt = require('jsonwebtoken');

// routes
const users = require('./routes/users');
const posts = require('./routes/posts');

const app = express();

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Request-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const staticPath = 'public';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// middleware that checks if JWT token exists and verifies it if it does exist.
// In all the future routes, this helps to know if the request is authenticated or not.
app.use((req, res, next) => {
// check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    next();
  }
});


app.use('/api/', posts);
app.use('/api/', users);
app.use(express.static(staticPath));
app.use('/', express.static(staticPath));
app.use('/posts/*', express.static(staticPath));
app.use('/new/*', express.static(staticPath));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
  console.dir(err);
  res.status(err.status || 500);
  if(err.status === 500) {
    console.error(err.stack);
    res.json({error: 'Internal Server Error'});
  }
  else if(err.status === 404) {
    res.render('error');    //render error page
  } else {
    res.json({error: err.message})
  }
});


mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/posts');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('DB connected!');
});

module.exports = app;
