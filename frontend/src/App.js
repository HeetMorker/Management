import React, { useEffect, useState } from 'react';
import { requestForToken, onMessageListener } from './firebase'; // Import onMessageListener for notifications
import axios from 'axios';
import Login from './Login';
import Tasks from './components/Tasks';

function App() {
  const [notification, setNotification] = useState({ title: '', body: '' });

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    const getFirebaseToken = async () => {
      const token = await requestForToken();
      if (token) {
        try {
          // Send the token to your backend to store it
          const response = await axios.put(
            'http://localhost:5000/api/user/update-token',
            { firebaseToken: token },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          console.log('Firebase token sent successfully:', response.data);
        } catch (error) {
          console.error('Error sending Firebase token:', error);
        }
      }
    };

    getFirebaseToken();

    // Listen for incoming notifications from Firebase Cloud Messaging
    onMessageListener()
      .then((payload) => {
        console.log('Notification received: ', payload);
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        });
      })
      .catch((err) => console.error('Failed to receive notification: ', err));
  }, []);

  return (
    <div className="App">
      <h1>Task Management App</h1>
      <Login />
      <Tasks/>

      {/* Display notification if it exists */}
      {notification.title && (
        <div className="notification">
          <h2>New Notification</h2>
          <p><strong>{notification.title}</strong></p>
          <p>{notification.body}</p>
        </div>
      )}
    </div>
  );
}

export default App;
