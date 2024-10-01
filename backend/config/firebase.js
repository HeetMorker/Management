const admin = require('firebase-admin');
const serviceAccount = require('../task-management-c14e7-firebase-adminsdk-daadp-c14fd823fa.json'); // Replace with the path to your downloaded JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
