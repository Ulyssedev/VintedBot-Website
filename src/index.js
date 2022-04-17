import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    connectAuthEmulator,
    signInWithEmailAndPassword,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCKd8gi7RIjeEIVj9GnAn4AvkBxgEmCJ2w",
  authDomain: "vintedbot-3f0d6.firebaseapp.com",
  projectId: "vintedbot-3f0d6",
  storageBucket: "vintedbot-3f0d6.appspot.com",
  messagingSenderId: "495357704111",
  appId: "1:495357704111:web:df56b60220ec07fd97e15a",
  measurementId: "G-F70EHN3FVM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099")

const loginEmailPassword = async () => {
    const loginEmail = txtEmail.value
    const loginPassword = txtPassword.value

    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    console.log(userCredential.user);
}

btnLogin.addEventListener("click", loginEmailPassword)

// continue with this video https://www.youtube.com/watch?v=rbuSx1yEgV8