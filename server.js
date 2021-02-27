const path = require('path');

const express = require('express');
const socketIo = require('socket.io');

const usersProfile = require('./utils/users');
const formatMessage = require('./utils/messages');
const viewRouter = require('./routes/viewRoutes');

const app = express();

const botName = 'ChatBot';

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// PUG FILES
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// SERVER
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});

// ROUTES
app.use('/', viewRouter);

const io = socketIo(server);

// RUNS WHEN CLIENT CONNECTS
io.on('connection', (socket) => {
  socket.on('joinRoom', (username, room) => {
    // CREATE A USER
    const user = usersProfile.userJoin(socket.id, username, room);

    // JOIN THE USER IN CURRENT ROOM
    socket.join(user.room);

    // EMIT TO THE USER ONLY
    socket.emit(
      'centerMessage',
      formatMessage(botName, 'Welcome to the Linky!!')
    );

    socket.emit('currentUser', user.username);

    // EMIT TO EVERYONE EXCEPT THE USER
    socket.broadcast
      .to(user.room)
      .emit('centerMessage', formatMessage(botName, `${username} joined`));

    // SEND USER INFO
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      usersName: usersProfile.getRoomUsers(user.room),
    });
  });

  socket.on('chatMessage', (message) => {
    const user = usersProfile.getCurrentUser(socket.id)[0];
    let msgObj = formatMessage(user.username, message);

    // BROADCAST TO EVERYONE EXCEPT THE USER
    socket.broadcast.to(user.room).emit('message', msgObj);

    // SEND TO THE USER ONLY
    msgObj.position = 'right';
    socket.emit('message', msgObj);
  });

  socket.on('disconnect', () => {
    const user = usersProfile.userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'centerMessage',
        formatMessage(botName, `${user.username} left`)
      );

      // SEND USER INFO
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        usersName: usersProfile.getRoomUsers(user.room),
      });
    }
  });
});
