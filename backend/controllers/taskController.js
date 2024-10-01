const {
  sendNotification,
  sendMulticastNotification,
} = require("./notificationController");
const Task = require("../models/Task");
const User = require("../models/User");

// Create a new task
const createTask = async (req, res) => {
  const { title, description, status, dueDate, category, assignedTo } =
    req.body;

  try {
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      category,
      assignedTo,
      createdBy: req.user._id, // from the JWT token
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: "Task creation failed", error });
  }
};

// Get all tasks (Admin can view all, Users only see their own tasks)
const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedTo createdBy", "username");
    } else {
      tasks = await Task.find({ createdBy: req.user._id });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch tasks", error });
  }
};

// Update a task (Users can only update their own tasks)
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, dueDate, category } = req.body;

  try {
    let task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the user is allowed to update the task
    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.category = category || task.category;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Task update failed", error });
  }
};

// Delete a task (Admins can delete any task; users can delete their own tasks)
const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the user is authorized to delete the task (admin can delete all, user only their own)
    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    // Delete the task using deleteOne
    await Task.deleteOne({ _id: taskId });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    // Send more detailed error information
    return res
      .status(400)
      .json({ message: "Task deletion failed", error: error.message });
  }
};

// const assignTask = async (req, res, io) => {
//   // Extract task details directly from req.body
//   const { title, description, dueDate, category, assignedTo, createdBy } =
//     req.body;

//   console.log("AssignedTo (userId):", assignedTo); // Log the assignedTo field

//   try {
//     // Find the user by the assignedTo (userId)
//     const user = await User.findById(assignedTo);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Create and assign the task
//     const task = new Task({
//       title: title, // Directly use the extracted title
//       description: description, // Directly use the extracted description
//       dueDate: dueDate,
//       category: category,
//       assignedTo: user._id,
//       createdBy: createdBy, // Use createdBy from request body
//     });

//     await task.save();

//     io.emit('taskUpdated', task); 
//     // Send notification to the assigned user
//     const notificationTitle = `New New Task is ${title}`;
//     const notificationBody = `Task Description: ${description}`;
//     await sendNotification(
//       user.firebaseToken,
//       notificationTitle,
//       notificationBody
//     );

//     res.status(200).json({ message: "Task assigned successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to assign task", error: error.message });
//   }
// };


const assignTask = async (req, res) => {
  // Extract task details directly from req.body
  const { title, description, dueDate, category, assignedTo, createdBy } = req.body;

  console.log("AssignedTo (userId):", assignedTo); // Log the assignedTo field

  try {
    // Find the user by the assignedTo (userId)
    const user = await User.findById(assignedTo);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create and assign the task
    const task = new Task({
      title: title, // Directly use the extracted title
      description: description, // Directly use the extracted description
      dueDate: dueDate,
      category: category,
      assignedTo: user._id,
      createdBy: createdBy, // Use createdBy from request body
    });

    await task.save();
    
    const io = req.app.get('socketio'); // Access Socket.io instance from app
    io.emit('taskUpdated', task);  // Notify all clients about the new task

    // Send notification to the assigned user
    const notificationTitle = `New Task: ${title}`;
    const notificationBody = `Task Description: ${description}`;
    await sendNotification(user.firebaseToken, notificationTitle, notificationBody);

    // Emit the event via Socket.io to notify all clients in real-time

    res.status(200).json({ message: "Task assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign task", error: error.message });
  }
};




// Mark Task as Completed and Send Notification
const completeTask = async (req, res) => {
  const { taskId } = req.body;
  try {
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Mark task as completed
    task.status = "Completed";
    await task.save();

    // Notify the user
    const user = await User.findById(task.assignedTo);
    const title = "Task Completed";
    const body = `Your task "${task.name}" has been completed.`;
    await sendNotification(user.firebaseToken, title, body);

    res.status(200).json({ message: "Task completed and notification sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to complete task", error: error.message });
  }
};

// Send Notification When a New Message is Received
const messageReceived = async (req, res) => {
  const { senderId, receiverId, messageText } = req.body;

  try {
    // Find the sender and receiver
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    // Send notification to the receiver
    const title = `New Message from ${sender.name}`;
    const body = `${sender.name}: ${messageText}`;
    await sendNotification(receiver.firebaseToken, title, body);

    res.status(200).json({ message: "Message received and notification sent" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to send message notification",
        error: error.message,
      });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask,
  completeTask,
  messageReceived,
};
