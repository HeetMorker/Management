// /routes/notificationRoutes.js
const express = require('express');
const sendNotification = require('../utils/sendNotification');
const User = require('../models/User');
const router = express.Router();

router.post('/send-test-notification', async (req, res) => {
  try {
    // Find a user (or use req.body.userId for specific user)
    const user = await User.findOne(); // Change this logic as per your need

    if (!user || !user.firebaseToken) {
      return res.status(404).json({ message: 'User or Firebase token not found' });
    }

    // Send a notification
    await sendNotification(user.firebaseToken, 'Test Notification', 'This is a test notification!');
    res.status(200).json({ message: 'Test notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
});

module.exports = router;
