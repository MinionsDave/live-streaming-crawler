const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const winston = require('winston');
const expressWinston = require('express-winston');

const sendErrMailFn = require('./util/mail');
const count = require('./util/visitCount');
const routes = require('./routes/index');
const author = require('./routes/author');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 访问数量+1
app.use((req, res, next) => {
  count.add();
  next();
});

app.use('/', routes);
app.use('/author', author);

// 处理404
app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});

// 开发环境中发送错误堆栈到前端
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// 生产环境中保留错误日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
    }),
  ],
}));

// 错误时发送邮件提醒
app.use(function(err, req, res, next) {
  sendErrMailFn(err);
  next(err);
});

// 生产环境中的错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


module.exports = app;
