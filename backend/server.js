const app = require('./app');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db'); 

dotenv.config();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.io with the server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Ensure this matches your frontend URL
    methods: ["GET", "POST"],
  },
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('taskUpdated', (task) => {
    io.emit('taskUpdated', task);  // Broadcast the updated task to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Make `io` available throughout the app
app.set('socketio', io);

// Start the server using `server.listen()` (not `app.listen()`)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectDB();  // Ensure the database is connected
  console.log(`Server running on localhost:${PORT}`);
});
