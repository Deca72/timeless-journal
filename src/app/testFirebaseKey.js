const admin = require("firebase-admin");
const serviceAccount = require("../../firebase-service-account.json");





try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase initialized successfully!");
} catch (err) {
  console.error("❌ Failed to initialize Firebase:", err.message);
}
