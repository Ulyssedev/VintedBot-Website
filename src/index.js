import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, signInWithCredential, signInWithCustomToken, fromJSON, OAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, endBefore, startAt, endAt, onSnapshot, arrayUnion, arrayRemove, increment, runTransaction, batch, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";


const firebaseConfig = {
    apiKey: "AIzaSyCKd8gi7RIjeEIVj9GnAn4AvkBxgEmCJ2w",
    authDomain: "vintedbot-3f0d6.firebaseapp.com",
    projectId: "vintedbot-3f0d6",
    storageBucket: "vintedbot-3f0d6.appspot.com",
    messagingSenderId: "495357704111",
    appId: "1:495357704111:web:df56b60220ec07fd97e15a",
    measurementId: "G-F70EHN3FVM"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth();
  const perf = getPerformance(app);
  const db = getFirestore(app);
  const functions = getFunctions(app);
  // For emulation use : 
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);


const signupForm = document.querySelector('.signup')
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value
    if (signupForm.terms.checked) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(cred => {
          console.log('user created:', cred.user)
          signupForm.reset()
          window.location = 'index.html'
        })
        .catch(err => {
          console.log(err.message)
          alert(err.message)
        })
    } else {
      alert('Please agree to terms and conditions')
    }
  })
}

const logoutButton = document.querySelector('.logout')
if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault()
    signOut(auth).then(() => {
      console.log('user signed out')
      window.location = 'index.html'
    })
    .catch(err => {
      console.log(err.message)
    })
  })
}

const loginForm = document.querySelector('.login')
if (loginForm) {
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      loginForm.reset()
      window.location = 'index.html'
    })
    .catch(err => {
      console.log(err.message)
      alert(err.message)
    })
})
}

onAuthStateChanged(auth, user => {
  if (user) {
    console.log('user logged in:', user)
    if (document.querySelector('.logout')) {
      document.querySelector('.logout').style.display = 'inline-block'
      document.querySelector('.dashboard').style.display = 'inline-block'
    }
  } else {
    console.log('user logged out')
    if (document.querySelector('.sign-up')) {
      document.querySelector('.sign-up').style.display = 'inline-block'
    }
  }
  if (user) {
    const docRef = doc(db, "users", user.uid);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        console.log("Document data:", doc.data());
        if (document.querySelector('.discord')) {
          document.querySelector('.discord').style.display = 'none'
        }
      }
      else {
        console.log("No such document!");
        if (document.querySelector('.discord')) {
          document.querySelector('.discord').style.display = 'inline-block'
        }
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }
})

const dashboardButton = document.querySelector('.dashboard')
if (dashboardButton) {
dashboardButton.addEventListener('click', (e) => {
  e.preventDefault()
  window.location = 'dashboard.html'
})
}

const manageButton = document.querySelector('.manage')
if (manageButton) {
manageButton.addEventListener('click', (e) => {
  e.preventDefault()
  window.open('https://billing.stripe.com/p/login/eVa17dcQLfO82fm8ww?prefilled_email='+auth.currentUser.email)
})
}

const discordButton = document.querySelector('.discordbutton')
if (discordButton) {
discordButton.addEventListener('click', (e) => {
  e.preventDefault()
  window.open('https://discord.gg/W6MRNaXwQ8')
})
}

const discordButtonMobile = document.querySelector('.discordbuttonmobile')
if (discordButtonMobile) {
discordButtonMobile.addEventListener('click', (e) => {
  e.preventDefault()
  window.open('https://discord.gg/W6MRNaXwQ8')
})
}

window.loginWithDiscord = () => {
  const clientId = "963382206443704342";
  const redirectUri = `${window.location.origin}/discord`;
  const scope = "identify";
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  window.location.href = url;
};

const confirmLoginWithDiscord = httpsCallable(functions, "confirmLoginWithDiscord");
if (new URLSearchParams(window.location.search).get("code")) {
  confirmLoginWithDiscord({ code: new URLSearchParams(window.location.search).get("code"), origin: window.location.origin })
    .then((result) => {
      const data = result.data;
      const { id, username, discriminator, avatar } = data;
        setDoc(doc(db, "users", auth.currentUser.uid), {
          discord: {
            id: id,
            username: username,
            discriminator: discriminator,
            avatar: avatar
        }
      }, { merge: true })
        .then(() => {
          console.log("Document successfully written!");
          window.location = 'dashboard.html'
        })})
    .catch((error) => {
      console.error("Error writing document: ", error);
    }
  );
}

if (localStorage.getItem("avatar")) {
  document.querySelectorAll('[id=avatar]').forEach(element => {
    element.src = localStorage.getItem("avatar");
  });
}
else {
onAuthStateChanged(auth, user => {
  if (user) {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((doc) => {
      if (doc.exists()) {
        if (doc.data().discord) {
          document.querySelectorAll('[id=avatar]').forEach(element => {
            element.src = "https://cdn.discordapp.com/avatars/" + doc.data().discord.id + "/" + doc.data().discord.avatar + ".png?size=256";
          });
          localStorage.setItem("avatar", "https://cdn.discordapp.com/avatars/" + doc.data().discord.id + "/" + doc.data().discord.avatar + ".png?size=256");
        }
      }
    })
  }
})
}

var avatarLink = document.getElementById("avatar-link");
var userMenu = document.getElementById("user-menu");

if (avatarLink) {
avatarLink.addEventListener("click", function() {
    userMenu.style.display = "block";
});
document.addEventListener('click', function(event) {
  if (!event.target.closest('#user-container')) {
      userMenu.style.display = 'none';
  }
});
avatarLink.addEventListener("touchstart", function() {
    userMenu.style.display = "block";
}
);
}