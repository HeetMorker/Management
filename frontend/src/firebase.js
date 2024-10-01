// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// // Your Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDHP0UWh26x7YP4wEm0KMmUzQRhtftKg7Y",
//   authDomain: "task-management-c14e7.firebaseapp.com",
//   projectId: "task-management-c14e7",
//   storageBucket: "task-management-c14e7.appspot.com",
//   messagingSenderId: "1028904862759",
//   appId: "1:1028904862759:web:4f40cbfbcd032ba159fa02",
//   measurementId: "G-LC9SJXFHJ7"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// // Request permission and get the token
// export const requestForToken = () => {
//     const messaging = getMessaging();
  
//     return navigator.serviceWorker
//       .register('/firebase-messaging-sw.js')
//       .then((registration) => {
//         return getToken(messaging, {
//           vapidKey: 'BL2VXqi04ujimGvV7nly-yZHbQi3VLc5fxdlsG_vyVkC8VMpf_RUVhHMmTLbW60ms3-36ZXxoGZswrqeT3AT9YY', // Make sure this is your VAPID key
//           serviceWorkerRegistration: registration,
//         });
//       })
//       .then((currentToken) => {
//         if (currentToken) {
//           console.log('Token generated:', currentToken);
//           return currentToken; // Return the token so you can save it to the backend
//         } else {
//           console.log('No registration token available.');
//           return null; // Handle case where there is no token
//         }
//       })
//       .catch((err) => {
//         if (err.code === 'messaging/token-unsubscribe-failed') {
//           console.error('Failed to unsubscribe the token, token might not exist:', err);
//         } else {
//           console.error('An error occurred while retrieving token:', err);
//         }
//       });
//   };

// // Listen for messages when app is in the foreground
// export const onMessageListener = () => {
//   return new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       console.log('Message received: ', payload);
//       resolve(payload);
//     });
//   });
// };









import { initializeApp } from 'firebase/app';
import { getMessaging ,getToken , onMessage } from 'firebase/messaging';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDHP0UWh26x7YP4wEm0KMmUzQRhtftKg7Y",
  authDomain: "task-management-c14e7.firebaseapp.com",
  projectId: "task-management-c14e7",
  storageBucket: "task-management-c14e7.appspot.com",
  messagingSenderId: "1028904862759",
  appId: "1:1028904862759:web:4f40cbfbcd032ba159fa02",
  measurementId: "G-LC9SJXFHJ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission to show notifications
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: 'BL2VXqi04ujimGvV7nly-yZHbQi3VLc5fxdlsG_vyVkC8VMpf_RUVhHMmTLbW60ms3-36ZXxoGZswrqeT3AT9YY' });
    if (token) {
      console.log('Firebase Token:', token);
      return token;
    } else {
      console.error('No registration token available. Request permission to generate one.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving the token.', error);
  }
};

// Listen for messages when the app is in the foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });
