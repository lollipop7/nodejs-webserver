var createError = require('http-errors');
var express = require('express');
var path = require('path');
let fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let session = require('express-session')
let RedisStore = require('connect-redis')(session)

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
let userRouter = require('./routes/user')
let blogRouter = require('./routes/blog')

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
const env = process.env.NODE_ENV
console.log(env)
if (env == 'dev') {
  // 开发环境 / 测试环境
  app.use(logger('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }))
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'WJiol#23123_',
  cookie: {
    // path: '/', // 默认配置
    // httpOnly: true, // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/user', userRouter)
app.use('/api/blog', blogRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // res.json({
  //     message: err.message,
  //     error: err
  // });
});

module.exports = app;
