const express = require('express');
const { createTask, getTasks, updateTask, deleteTask , assignTask, completeTask, messageReceived } = require('../controllers/taskController'); 
const { protect, admin } = require('../middleware/authmiddleware');

const router = express.Router();

// Routes for task management
router.route('/')
  .get(protect, getTasks)     // Ensure that 'getTasks' is correctly defined in the controller
  .post(protect, createTask); // Ensure that 'createTask' is correctly defined in the controller

router.route('/:taskId')
  .put(protect, updateTask)   // Ensure that 'updateTask' is correctly defined in the controller
  .delete(protect, deleteTask); // Ensure that 'deleteTask' is correctly defined in the controller

router.post('/assign', protect, assignTask);
router.post('/complete', protect, completeTask);
router.post('/message', protect, messageReceived);

module.exports = router;
