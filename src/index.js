import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, signInWithCredential, signInWithCustomToken, fromJSON, OAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, endBefore, startAt, endAt, onSnapshot, arrayUnion, arrayRemove, increment, runTransaction, batch, connectFirestoreEmulator } from "firebase/firestore";


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
  // For emulation use : 
   connectAuthEmulator(auth, "http://127.0.0.1:9099");
   connectFirestoreEmulator(db, "localhost", 8080);


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
    if (document.querySelector('.button.small')) {
      document.querySelector('.button.small').style.display = 'inline-block'
    }
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
  const clientId = "CLIENT_ID";
  const redirectUri = `${window.location.origin}/discord`;
  const scope = "identify";
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  window.location.href = url;
}

window.confirmLoginWithDiscord = () => {
  const clientId = "CLIENT_ID";
  const clientSecret = "CLIENT_SECRET";
  const redirectUri = `${window.location.origin}/discord`;
  const code = new URLSearchParams(window.location.search).get("code");
  const grant_type = "authorization_code";
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("grant_type", grant_type);
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  fetch('https://discord.com/api/oauth2/token', { method: "POST", body: params })
.then(response => response.json())
.then(data => {
  const { access_token, token_type } = data;
  fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${token_type} ${access_token}`,
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    const { id, username, discriminator, avatar } = data;
    console.log(id, username, discriminator, avatar)
    setDoc(doc(db, "users", auth.currentUser.uid), {
      discord: {
        id: id,
        username: username,
        discriminator: discriminator,
        avatar: avatar
      }
    }, { merge: true })
    window.location = 'dashboard.html'
  });
});
}

window.displayavatar = () => {
  if (localStorage.getItem("avatar")) {
    document.getElementById("avatar").src = localStorage.getItem("avatar");
    return;
  }
  onAuthStateChanged(auth, user => {
    if (user) {
      getDoc(doc(db, "users", auth.currentUser.uid)).then((doc) => {
        if (doc.exists()) {
          if (doc.data().discord) {
            document.getElementById("avatar").src = "https://cdn.discordapp.com/avatars/" + doc.data().discord.id + "/" + doc.data().discord.avatar + ".png?size=256";
            localStorage.setItem("avatar", "https://cdn.discordapp.com/avatars/" + doc.data().discord.id + "/" + doc.data().discord.avatar + ".png?size=256");
          }
        }
      })
    }
  })
}
