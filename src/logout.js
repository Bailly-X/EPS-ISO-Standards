import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged, 
  signOut
} from "firebase/auth";

console.log("test");

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

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = './login.html';
  } else {
      return;
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = './login.html';
});
