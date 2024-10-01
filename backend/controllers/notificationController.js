// notificationController.js
const admin = require('../config/firebase');
const sendNotification = async (firebaseToken, title, body) => {
  if (!firebaseToken) {
    console.error('Error: Firebase token is missing');
    return;
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: firebaseToken,  // Use the firebaseToken here
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
  
  // Function to send notifications to multiple users
  const sendMulticastNotification = async (firebaseTokens, title, body) => {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens: firebaseTokens, // Array of Firebase tokens
    };
  
    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log('Multicast notification sent successfully:', response);
    } catch (error) {
      console.error('Error sending multicast notification:', error);
    }
  };
module.exports = { sendNotification ,sendMulticastNotification };
