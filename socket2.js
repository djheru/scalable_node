var io = require('socket.io').listen(3000);

io.sockets.on('connection', function(socket){

  socket.on('join', function(data){
    socket.username = data.username;
    console.log('set socket.username', data, socket.username)
    socket.broadcast.emit('join', {username: data.username, socket: socket.id});
  });

  socket.on('ping', function(){
    console.log('socket.username', socket.username)
    socket.broadcast.emit('ping', {username: socket.username});
  });

  socket.on('privatePing', function(data){
    console.log('data: ', data)
    console.log('socket.username', socket.username)
    io.sockets.connected[data.socket].emit('ping', {
      username: socket.username,
      priv: true
    });
  });
});

io.of('/vip').on('connection', function(socket){

  socket.on('join', function(data){
    socket.username = data.username;
    socket.broadcast.emit('join', {username: data.username, socket: socket.id});
  });

  socket.on('ping', function(){
    console.log('socket.username: ', socket.username)
    socket.broadcast.emit('ping', {username: socket.username});
  });

  socket.on('privatePing', function(data){
    console.log('privatePing')
    io.of('/vip').connected[data.socket].emit('ping', {
      username: socket.username,
      priv: true
    });
  });
});
