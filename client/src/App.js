import React from 'react';
import io from 'socket.io-client';
const uuidv1 = require('uuid/v1');

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000');
    this.socket.on('addTask', (task) => {this.addTask(task)});
    this.socket.on('removeTask', (taskId) => {this.removeTask(taskId)});
    this.socket.on('updateData', (tasksList) => {this.updateTasks(tasksList)});
  }
  
  updateTasks(tasksList) {
    this.setState({ tasks: tasksList});
  };

  removeTask(taskId, isLocalChange) {
    const { tasks } = this.state;

    this.setState({
      tasks: tasks.filter(item => item.id !== taskId),
    })

    if (isLocalChange) {
      this.socket.emit('removeTask', taskId);
    }
  }

  addTask(newTask) {
    this.setState({ tasks: [...this.state.tasks, newTask] });
  }

  submitForm(e) {
    const { taskName } = this.state;

    e.preventDefault();
    const newTask = { id: uuidv1(), name: taskName };
    this.addTask(newTask);     //{ id: id, name: this.state.taskName}
    this.socket.emit('addTask', newTask);
  }

  render() {
    const { tasks, taskName } = this.state;
    
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(item => (
              <li key={item.id} className="task">
                {item.name}
              <button className="btn btn--red" onClick={() => this.removeTask(item.id, true)}>Remove</button>
              </li>
            ))}
          </ul>
    
          <form id="add-task-form"
            onSubmit={(e) => this.submitForm(e)}>
            <input 
              className="text-input" 
              autoComplete="off" 
              type="text" 
              placeholder="Add new task" 
              id="task-name" 
              value={taskName}
              onChange={(e) => this.setState({taskName: e.target.value})}
            />

            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };
};

export default App;
