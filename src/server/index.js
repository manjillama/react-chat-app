// Setup basic express server
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { VERIFY_USER, LOGIN, USER_JOINED, ADD_USER, NEW_MESSAGE, TYPING, STOP_TYPING, USER_LEFT } = require('../events');


const port = process.env.PORT || 5000;
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

  socket.on(VERIFY_USER, (username, callback) => {
    if(isUser(users, username)){
      callback({isUser: true, username: null})
    }else{
      callback({isUser: false, username})
    }
  })

  // when the client emits 'add user', this listens and executes
  socket.on(ADD_USER, (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    users.push(username);
    addedUser = true;
    socket.emit(LOGIN, {
      users,
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit(USER_JOINED, {
      users,
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'new message', this listens and executes
  socket.on(NEW_MESSAGE, (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit(NEW_MESSAGE, {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on(TYPING, () => {
    socket.broadcast.emit(TYPING, {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on(STOP_TYPING, () => {
    socket.broadcast.emit(STOP_TYPING, {
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
      socket.broadcast.emit(USER_LEFT, {
        users,
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

function isUser(users, username){
  return users.some(userName => {
    return username === userName
  })
}
