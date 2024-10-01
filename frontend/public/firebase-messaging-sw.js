// Use importScripts to include Firebase messaging in service workers
importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyDHP0UWh26x7YP4wEm0KMmUzQRhtftKg7Y",
  authDomain: "task-management-c14e7.firebaseapp.com",
  projectId: "task-management-c14e7",
  storageBucket: "task-management-c14e7.appspot.com",
  messagingSenderId: "1028904862759",
  appId: "1:1028904862759:web:4f40cbfbcd032ba159fa02",
  measurementId: "G-LC9SJXFHJ7"
};

// Initialize Firebase in the service worker
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
