var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket_io = require('socket.io');
const cors = require('cors');
const whitelist = ['http://localhost:9000'];
// const mongoUtil = require('./mongo');

const corsOptions = {
  credentials: true, 
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require('./routes/testAPI');
var joinGameRouter = require('./routes/joinGame');
var newGameRouter = require('./routes/newGame');

var app = express();

var io = socket_io({transports: ['websocket']});
app.io = io;

app.set('socket.io', io);
var newGame = require('./bin/connection/newGame');
var joinGame = require('./bin/connection/joinGame');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/testAPI', testAPIRouter);
// app.use('/joinGame', joinGameRouter);
// app.use('/newGame', newGameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// // Initialize Database connection
// mongoUtil.connectToServer();

// Socket.io events
io.on('connection', function(socket) {

  // socket.on('reconnect_attempt', () => {
  //   socket.io.opts.transports = ['polling', 'websocket']
  // })

  socket.on('join game', function(data) {
    console.log("Joining game.");
    console.log(data);
    joinGame.join(socket, data.username, data.lobbyCode);
  });
  

  socket.on('new game', function(data) {
    console.log(data);
    newGame.start(socket);
  });

});


module.exports = app;
