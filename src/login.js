import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged, 
  signOut
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDl1nPpTswleVElEvOoGu-f71S2ZOjP5Nw",
  authDomain: "plain-language-game.firebaseapp.com",
  projectId: "plain-language-game",
  storageBucket: "plain-language-game.firebasestorage.app",
  messagingSenderId: "611269319621",
  appId: "1:611269319621:web:2d5dc8981f44dafe4c49ac",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// SIGN UP (Register)
document.getElementById("signupBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      createdAt: new Date()
    });

    document.getElementById("authMessage").textContent = "✅ Account created! You can now log in.";
    console.log("User saved to Firestore");
  } catch (error) {
    document.getElementById("authMessage").textContent = `❌ ${error.message}`;
  }
});

// LOGIN
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      document.getElementById("authMessage").textContent =
        "✅ Logged in successfully!";
      console.log("User logged in:", userCredential.user.email);
      window.location.href = '../main-menu.html';
    })
    .catch((error) => {
      document.getElementById("authMessage").textContent = `❌ ${error.message}`;
    });
});

onAuthStateChanged(auth, (user) => {
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth);
  window.location.href = './login.html';
});