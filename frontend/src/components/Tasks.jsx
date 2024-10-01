import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Initialize socket only once
const socket = io('http://localhost:5000');

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Listen for real-time task updates
    socket.on('taskUpdated', (task) => {
      console.log('Real-time task update received:', task);
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    // Cleanup when the component unmounts
    return () => {
      socket.off('taskUpdated');
    };
  }, []);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>{task.title} - {task.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
