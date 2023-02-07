import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, signInWithCredential, signInWithCustomToken, fromJSON, OAuthProvider, getIdTokenResult, confirmPasswordReset } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, endBefore, startAt, endAt, onSnapshot, arrayUnion, arrayRemove, increment, runTransaction, batch, connectFirestoreEmulator, addDoc, Firestore } from "firebase/firestore";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { getStripePayments, getCurrentUserSubscriptions, createCheckoutSession } from "@stripe/firestore-stripe-payments";


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
  const functions = getFunctions(app, "europe-west1");
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
          //if callback not in the url
          if (window.location.href.indexOf("callback") == -1) {
            window.location = 'index.html'
          }
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
  document.querySelectorAll('.logout').forEach((element) => {
  element.addEventListener('click', (e) => {
    e.preventDefault()
    signOut(auth).then(() => {
      console.log('user signed out')
      window.location = 'index.html'
      if (localStorage.getItem("avatar")) {
        localStorage.removeItem("avatar")
      }
    })
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
      if (window.location.href.indexOf("callback") == -1) {
        window.location = 'index.html'
      }
    })
    .catch(err => {
      console.log(err.message)
      alert(err.message)
    })
})
}

onAuthStateChanged(auth, user => {
  const signupelement = document.getElementsByClassName("depth-1")[4];
  const dashboardelement = document.getElementsByClassName("depth-1")[5];
  const discordelement = document.getElementsByClassName("depth-1")[6];
  const logoutelement = document.getElementsByClassName("depth-1")[7];
  if (user) {
    console.log('user logged in:', user)
    if (document.querySelector('.logout')) {
      document.querySelectorAll('.logout').forEach((element) => {
        element.style.display = 'inline-block'
      })
    }

    if (document.querySelector('.dashboard')) {
      document.querySelectorAll('.dashboard').forEach((element) => {
        element.style.display = 'inline-block'
      })
    }
    if (signupelement) {
    signupelement.parentNode.removeChild(signupelement);
    }
    if (discordelement) {
    discordelement.addEventListener('click', (e) => {
      e.preventDefault()
      loginWithDiscord()
    })}
    if (logoutelement) {
    logoutelement.addEventListener('click', (e) => {
      e.preventDefault()
      signOut(auth).then(() => {
        console.log('user signed out')
        window.location = 'index.html'
        if (localStorage.getItem("avatar")) {
          localStorage.removeItem("avatar")
        }
      })})}
    }
    else {
    console.log('user logged out')
    if (document.querySelector('.sign-up')) {
      document.querySelectorAll('.sign-up').forEach((element) => {
        element.style.display = 'inline-block'
      })
    }
    if (logoutelement) {
    logoutelement.parentNode.removeChild(logoutelement);
    }
    if (discordelement) {
    discordelement.parentNode.removeChild(discordelement);
    }
    if (dashboardelement) {
    dashboardelement.parentNode.removeChild(dashboardelement);
    }
  }
  if (user) {
    const docRef = doc(db, "users", user.uid);
    getDoc(doc(db, "users", auth.currentUser.uid)).then((doc) => {
      if (doc.exists()) {
        if (doc.data().discord) {
      //if the field username is in the database
        console.log("Document data:", doc.data());
          if (document.querySelector('.discord')) {
            document.querySelectorAll('.discord').forEach((element) => {
              element.style.display = 'none'
            }
            )
          }
        if (discordelement) {
        discordelement.parentNode.removeChild(discordelement);
}}
else {
  console.log("No such document!");
  if (document.querySelector('.discord')) {
    document.querySelectorAll('.discord').forEach((element) => {
      element.style.display = 'inline-block'
    }
    )
}}
}}
).catch((error) => {
      console.log("Error getting document:", error);
    });
  }
})

if (window.location.href.includes("discord") && !window.location.href.includes("code=") && !window.location.href.includes("callback="))  {
  //if the user is logged in
  onAuthStateChanged(auth, user => {
    if (user) {
      //if the user is logged in and has a discord account
      const docRef = doc(db, "users", user.uid);
      getDoc(doc(db, "users", auth.currentUser.uid)).then((doc) => {
        if (doc.exists()) {
          if (doc.data().discord) {
            getCurrentUserSubscriptions(payments).then((subscriptions) => {
              //set the id to the discordid
              const id = doc.data().discord.id
              //set the tokens to the discord tokens
              const tokens = doc.data().discord.tokens
              if (subscriptions.length > 0) {
                if (subscriptions[0].role === "starter") {
                  // set the metadata
                  const metadata = {
                    isstarter: 1,
                  };
                  pushMetadata({ userId: id, tokens: tokens, metadata: metadata })
                }
                if (subscriptions[0].role === "classic") {
                  // set the metadata
                  const metadata = {
                    isclassic: 1,
                  };
                  pushMetadata({ userId: id, tokens: tokens, metadata: metadata })
                }
                if (subscriptions[0].role === "pro") {
                  // set the metadata
                  const metadata = {
                    ispro: 1,
                  };
                  pushMetadata({ userId: id, tokens: tokens, metadata: metadata })
                }
              }
              else {
                const metadata = {
                  isregistered: 1,
                };
                pushMetadata({ userId: id, tokens: tokens, metadata: metadata })
                console.log(metadata)
              }
            })
            window.location.href = "dashboard.html";
          }
          else {
            loginWithDiscord()
          }
        }
      })
    }
    else {
      const userLang = navigator.language || navigator.userLanguage;
      if (userLang.includes("fr")) {
        window.location = "inscription"
      }
      if (userLang.includes("en")) {
        window.location = "signup"
      }
      if (userLang.includes("pl")) {
        window.location = "rejestracja"
      }
      else {
        window.location = "signup?callback=discord"
      }
    }
  })
}

//if callback is a url parameter
var submitInput = document.querySelector("input[type='submit']");

if (new URLSearchParams(window.location.search).get("callback") && submitInput) {
  submitInput.addEventListener("click", function(e) {
    var callback = getParameterByName("callback");
    if (callback) {
      //wait for the user to be logged in
      onAuthStateChanged(auth, user => {
        if (user) {
      window.location.href = callback;
    }
  })
}

  });
  
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
  

const dashboardButton = document.querySelector('.dashboard')
if (dashboardButton) {
dashboardButton.addEventListener('click', (e) => {
  e.preventDefault()
  window.location = 'dashboard.html'
})
}

const manageButton = document.querySelector('.manage')
const createPortalLink = httpsCallable(functions, 'ext-firestore-stripe-payments-createPortalLink')
if (manageButton) {
//call createPortalLink function asynchrnously
manageButton.addEventListener('click', async (e) => {
  e.preventDefault()
  manageButton.innerHTML = '';
  manageButton.classList.add('load');
  await createPortalLink({ returnUrl: window.location.origin })
    .then((result) => {
      window.location.assign(result.data.url)
    })
    .catch((error) => {
      console.log(error)
    })
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
  const scope = "role_connections.write identify";
  const state = auth.currentUser.uid;
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&prompt=consent`;
  document.cookie = `clientState=${state}; max-age=${1000 * 60 * 5};`;
  window.location.href = url;
};

const confirmLoginWithDiscord = httpsCallable(functions, "confirmLoginWithDiscord");
const pushMetadata = httpsCallable(functions, "pushMetadata");
const getMetadata = httpsCallable(functions, "getMetadata");
if (new URLSearchParams(window.location.search).get("code")) {
  confirmLoginWithDiscord({ code: new URLSearchParams(window.location.search).get("code"), origin: window.location.origin, state: new URLSearchParams(window.location.search).get("state") })
    .then((result) => {
      const data = result.data;
      const { id, username, discriminator, avatar, tokens } = data;
      console.log(id, username, discriminator, avatar, tokens)
        setDoc(doc(db, "users", auth.currentUser.uid), {
          discord: {
            id: id,
            username: username,
            discriminator: discriminator,
            avatar: avatar,
            tokens: tokens,
        }
      }, { merge: true })
        .then(() => {
          console.log("Document successfully written!");
          getCurrentUserSubscriptions(payments).then((subscriptions) => {
            // set the metadata
            if (subscriptions.length > 0) {
              if (subscriptions[0].role === "starter") {
                // set the metadata
                const metadata = {
                  isstarter: 1,
                };
                pushMetadata({ userId: id, tokens: tokens, metadata: metadata })
              }
              if (subscriptions[0].role === "classic") {
                // set the metadata
                const metadata = {
                  isclassic: 1,
                };
                pushMetadata({ userId: id, tokens: tokens, metadata: metadata })
              }
              if (subscriptions[0].role === "pro") {
                // set the metadata
                const metadata = {
                  ispro: 1,
                };
                pushMetadata({ userId: id, tokens: tokens, metadata: metadata })
              }
            }
            else {
              const metadata = {
                isregistered: 1,
              };
              pushMetadata({ userId: id, tokens: tokens, metadata: metadata })
            }
            window.location.href = "dashboard.html";
            
        })})
    .catch((error) => {
      console.error("Error writing document: ", error);
    }
  );
    })
  }

const handleWebhookEvents  = httpsCallable(functions, "ext-firestore-stripe-payments-handleWebhookEvents");

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

//stripe stuff
const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "users",
});

// Listen to the button
document.querySelectorAll(".buybutton").forEach((button) => {
  button.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (user) {
      button.innerHTML = '';
      button.classList.replace('buybutton', 'load');
      await createCheckoutSession(payments, {
        successUrl: window.location.origin + "/dashboard",
        cancelUrl: window.location.origin + "/dashboard",
        price: `${button.id}`,
        customerEmail: user.email,
      })
        .then((session) => {
          window.location = session.url;
        })
    }
    else {
      window.location = document.querySelector(".sign-up a").href;
    }
  });
});



// list current subscriptions
onAuthStateChanged(auth, async (user) => {
  if (user) {
    getCurrentUserSubscriptions(payments).then((subscriptions) => {
      subscriptions.forEach((subscription) => {
        console.log(subscription.role);
        if (document.querySelector(".user-info")) {
          document.querySelector(".user-info").style.display = "block";
          document.querySelector(".email").innerHTML = user.email;
          document.querySelector(".subscription").innerHTML = subscription.role.toUpperCase();
          document.querySelector(".managebutton").style.display = "block";
        }
      const docRef = doc(db, "users", auth.currentUser.uid);
      getDoc(doc(db, "users", auth.currentUser.uid)).then((doc) => {
        if (doc.exists()) {
          if (doc.data().vintedbot) {
            document.querySelector(".vintedbot-info").style.display = "block";
            document.querySelector(".vintedbot-subsleft").innerHTML = 'Available channels: ' + doc.data().vintedbot.subs_left;
            const channelids = Object.keys(doc.data().vintedbot.channels);
            channelids.forEach((channelid, index) => {
              const channelurltext = doc.data().vintedbot.channels[channelid].url;
              const channelElement = `
              <li class="vintedbot-channel">
              <div class="vintedbot-channel-text-and-buttons">
                <button class="vintedbot-channel-expand-button">▶️</button>  
                <div class="vintedbot-channel-text">Channel ${index + 1}</div>
                <button class="vintedbot-channel-edit-button">✏️</button>
              </div>
              <div class="vintedbot-channel-url" style="display: none;">${channelurltext}</div>
              </li>
              `;
              document.querySelector(".vintedbot-channels").innerHTML += channelElement;
              
              const expandButtons = document.querySelectorAll(".vintedbot-channel-expand-button");
              expandButtons.forEach((expandButton) => {
                expandButton.addEventListener("click", () => {
                  const channelUrl = expandButton.parentElement.parentElement.querySelector(".vintedbot-channel-url");
                  if (channelUrl.style.display === "none") {
                    channelUrl.style.display = "block";
                    expandButton.innerHTML = "🔽";
                  } else {
                    channelUrl.style.display = "none";
                    expandButton.innerHTML = "▶️";
                  }
                });
              });
              const editButtons = document.querySelectorAll(".vintedbot-channel-edit-button");
              editButtons.forEach((editButton) => {
                editButton.addEventListener("click", () => {
                  const channelUrl = editButton.parentElement.parentElement.querySelector(".vintedbot-channel-url");
                  const channelUrlInput = document.createElement("input");
                  channelUrlInput.value = channelUrl.textContent;
                  channelUrlInput.type = "text";
                  channelUrlInput.classList.add("vintedbot-channel-url-input");
                  channelUrl.innerHTML = "";
                  channelUrl.appendChild(channelUrlInput);
                  channelUrl.style.display = "block";
              
                  const enterButton = document.createElement("button");
                  enterButton.textContent = "Enter";
                  enterButton.classList.add("vintedbot-enter-button");
                  channelUrl.appendChild(enterButton);
              
                  enterButton.addEventListener("click", async () => {
                    const newUrl = channelUrlInput.value;
                    channelUrl.innerHTML = newUrl;
                    channelUrl.style.display = "none";
              
                    const channelId = channelids[index];
                    const newChannel = {
                      url: newUrl,
                    };
                    await updateDoc(docRef, { [`vintedbot.channels.${channelId}`]: newChannel })
                  });
                });
              });
            });
          }
        }
      });
    });
  });
}
});
