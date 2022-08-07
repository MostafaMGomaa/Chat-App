// const path = require("path");
const app = require('./app');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const {
  getCurrentUser,
  userJoin,
  userLeave,
  getRoomUser,
} = require('./utils/users');

const server = http.createServer(app);
const io = socketio(server);

const botName = 'Chat Bot';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

// Run when clinets connection
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcom to new users
    socket.emit('message', formatMessage(botName, 'Welcom To Chat App!'));

    // BroadCast when user connect.
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} user has join chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUser(user.room),
    });
  });

  // Listen to chat message
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnect.
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUser(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server  running on port ${PORT}`));
