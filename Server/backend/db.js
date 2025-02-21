const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
console.log("🔥 Firestore đã kết nối thành công!");

module.exports = { db, admin }; // Export cả db và admin
