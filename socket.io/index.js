var io = require('socket.io')
  , connect = require('connect')
  , config = require('../config')
  , cookie = require('cookie')
  , cookieParser = require('cookie-parser')
  , expressSession = require('express-session')
  , ConnectRedis = require('connect-redis')(expressSession)
  , redisSession= new ConnectRedis({host: config.redisHost, port: config.redisPort})
  , redisAdapter = require('socket.io-redis');

var socketAuth = function socketAuth(socket, next){
  var handshakeData = socket.request;
  var parsedCookie = cookie.parse(handshakeData.headers.cookie);
  //var sid = connect.utils.parseSignedCookie(parsedCookie['connect.sid'], config.secret);
  var sid = cookieParser.signedCookie(parsedCookie['connect.sid'], config.secret);
  //ensure valid signed session id
  if(parsedCookie['connect.sid'] === sid) {
    return next(new Error('not authenticated'));
  }
  redisSession.get(sid, function(err, session){
    if(session.isAuthenticated){
      socket.user = session.user;
      socket.sid = sid;
      return next();
    } else {
      return next(new Error('Not Authenticated'));
    }
  });
};

var socketConnection = function socketConnection(socket) {
  socket.on('GetMe', function(){});
  socket.on('GetUser', function(room){});
  socket.on('GetChat', function(data){});
  socket.on('AddChat', function(chat){});
  socket.on('GetRoom', function(){});
  socket.on('AddRoom', function(r){});
  socket.on('disconnect', function(){});
}

exports.startIo = function startIo(server){
  io = io.listen(server);
  io.adapter(redisAdapter({host: config.redisHost, port: config.redisPort}))
  var packtchat = io.of('/packtchat');
  packtchat.use(socketAuth);
  packtchat.on('connection', socketConnection);
  return io;
}