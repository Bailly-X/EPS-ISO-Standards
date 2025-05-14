import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

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

// SIGN UP (Register)
document.getElementById("signupBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      document.getElementById("authMessage").textContent =
        "✅ Account created! You can now log in.";
      console.log("User registered:", userCredential.user.email);
    })
    .catch((error) => {
      document.getElementById("authMessage").textContent = `❌ ${error.message}`;
    });
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
    })
    .catch((error) => {
      document.getElementById("authMessage").textContent = `❌ ${error.message}`;
    });
});
