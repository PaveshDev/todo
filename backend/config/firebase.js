const admin = require("firebase-admin");
const path = require("path");

// Resolve service account path relative to the backend root directory
const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const serviceAccountPath = envPath
  ? path.resolve(__dirname, "..", envPath)
  : path.join(__dirname, "..", "serviceAccountKey.json");

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (err) {
  console.error(
    `❌ Firebase service account key not found at: ${serviceAccountPath}`
  );
  console.error(
    "   Download it from Firebase Console → Project Settings → Service Accounts → Generate New Private Key"
  );
  console.error(
    '   Place it as "serviceAccountKey.json" in the backend folder, or set FIREBASE_SERVICE_ACCOUNT_PATH in .env'
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Use REST transport instead of gRPC (more reliable on some networks)
db.settings({ preferRest: true });

console.log("🔥 Firebase Firestore connected successfully");

module.exports = { admin, db };
