var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const expressEjsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const { ensureAuthenticated, adminAuthenticated } = require('./middlewares/auth.middleware');

var app = express();

// view engine setup
app.use(expressEjsLayouts)
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', './layout')
app.use('/public', express.static(__dirname + 'public'))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/ssr').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('Error connecting to MongoDB', err);
})

app.use(session({
  secret: "haha",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: 'mongodb://localhost:27017/ssr' })
}))

app.use((req, res, next) => {
  res.locals.member = req.session.member || null;
  res.locals.perfumes = req.session.perfumes || null
  res.locals.brands = req.session.brands || null
  res.locals.comments = req.session.comments || null
  res.locals.error = req.session.error || null;
  req.session.error = null;
  next();
});

app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/members', ensureAuthenticated, require('./routes/members'));
app.use('/perfumes', require('./routes/perfumes'));
app.use('/brands', ensureAuthenticated, adminAuthenticated, require('./routes/brands'));
app.use('/comments', ensureAuthenticated, require('./routes/comments'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
