const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); 
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); 
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');   

dotenv.config();

// Create express app
const app = express();
app.use(bodyParser.json());

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Export the app
module.exports = app;
