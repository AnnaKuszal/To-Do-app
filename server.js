const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [
  { id: 'dfsadf324s', name: 'Shopping'}, 
  { id: 'dfs2ad6724s', name: 'Go out with a dog'}
];

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

  socket.on('removeTask', (taskId) => {
    console.log('Task with id ' + taskId + ' removed');
    socket.broadcast.emit('removeTask', taskId);
    tasks.splice(taskId, 1);
  });


});