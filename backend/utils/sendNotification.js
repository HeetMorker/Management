const admin = require('../config/firebase');

const sendNotification = async (token, title, body, data) => {
  const message = {
    notification: {
      title,
      body,
    },
    data: data || {},  // Optional additional data
    token,  // Device token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = sendNotification;
