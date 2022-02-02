import admin from "firebase-admin";
const serviceAccount = require("../../../praha-challenge-firebase-firebase-adminsdk-x38ii-48d5858b4a.json");

export const initFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
};
