// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/../../build'))

// Chatroom

var numUsers = 0;
var users = [];

io.on('connection', (socket) => {
  var addedUser = false;

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    users.push(username);
    addedUser = true;
    socket.emit('login', {
      users,
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      users,
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      const newUsers = users.filter(username => username !== socket.username)
      users = newUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        users,
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
