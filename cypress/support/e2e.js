
import './commands'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import { attachCustomCommands } from 'cypress-firebase';

const fbConfig = {
  apiKey: "AIzaSyCKd8gi7RIjeEIVj9GnAn4AvkBxgEmCJ2w",
  authDomain: "vintedbot-3f0d6.firebaseapp.com",
  projectId: "vintedbot-3f0d6",
  storageBucket: "vintedbot-3f0d6.appspot.com",
  messagingSenderId: "495357704111",
  appId: "1:495357704111:web:df56b60220ec07fd97e15a",
  measurementId: "G-F70EHN3FVM"
};

firebase.initializeApp(fbConfig);
firebase.auth().useEmulator('http://localhost:9099');
firebase.firestore().useEmulator('localhost', 8080);

firebase.auth().createUserWithEmailAndPassword('test@vintedbot.com', 'Test123456789!')
.then((userCredential) => {
  Cypress.env('uid', userCredential.user.uid)
})
.catch(function(error) {
  console.log(error);
});

attachCustomCommands({ Cypress, cy, firebase });