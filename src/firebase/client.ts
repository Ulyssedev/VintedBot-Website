import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCKd8gi7RIjeEIVj9GnAn4AvkBxgEmCJ2w",
  authDomain: "vintedbot-3f0d6.firebaseapp.com",
  projectId: "vintedbot-3f0d6",
  storageBucket: "vintedbot-3f0d6.appspot.com",
  messagingSenderId: "495357704111",
  appId: "1:495357704111:web:df56b60220ec07fd97e15a",
  measurementId: "G-F70EHN3FVM",
};

const app = initializeApp(firebaseConfig);

var db;
const auth = getAuth(app);
if (process.env.NODE_ENV === "development") {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} else {
  db = getFirestore(app);
}
const functions = getFunctions(app, "europe-west1");

export { auth, db, functions, app };
