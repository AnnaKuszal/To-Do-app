const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [];

app.use(express.static(path.join(__dirname + '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({message: 'Not found...'});
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! It\'s id – ' + socket.id);

  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    console.log('New task added', task);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (index) => {
    console.log('Task with id ' + index + ' removed');
    socket.broadcast.emit('removeTask', index);
    tasks.splice(index, 1);
  });


});