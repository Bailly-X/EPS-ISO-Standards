import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDl1nPpTswleVElEvOoGu-f71S2ZOjP5Nw",
  authDomain: "plain-language-game.firebaseapp.com",
  projectId: "plain-language-game",
  storageBucket: "plain-language-game.firebasestorage.app",
  messagingSenderId: "611269319621",
  appId: "1:611269319621:web:2d5dc8981f44dafe4c49ac",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const textarea = document.getElementById("custom-text");
const readyBtn = document.getElementById("ready-btn");

let gameId = localStorage.getItem("currentGameId");

document.getElementById("backButton").addEventListener("click", () => {
  window.location.href = "./main-menu.html";
});

window.addEventListener("DOMContentLoaded", () => {
    const pickedText = sessionStorage.getItem("pickedText");
    if (pickedText) {
        textarea.value = pickedText
        sessionStorage.removeItem("pickedText");w
    }
});

auth.onAuthStateChanged(async (user) => {
  if (!user) return;
  readyBtn.onclick = async () => {
    const value = textarea.value.trim();
    if (!value) {
      alert("Please write your text!");
      return;
    }
    if (!gameId) {
      alert("Game not found.");
      return;
    }
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);
    if (!gameSnap.exists()) {
      alert("Game not found.");
      return;
    }
    const gameData = gameSnap.data();
    let rounds = gameData.rounds || [];
    if (!rounds[0]) rounds[0] = { texts: {} };
    if (!rounds[0].texts) rounds[0].texts = {};
    rounds[0].texts[user.uid] = value;

    await updateDoc(gameRef, { rounds });

    const allUids = gameData.playerIds;
    const submittedUids = Object.keys(rounds[0].texts || {});
    const everyoneReady = allUids.every(uid => submittedUids.includes(uid));

    if (everyoneReady) {
      rounds[0].status = "ready";
      await updateDoc(gameRef, {
        rounds,
        currentRound: 1,
        status: "started"
      });
      alert("You will be redirected to the menu, you can wait for the others");
      window.location.href = "./main-menu.html";
      } else {
        readyBtn.disabled = true;
      alert("You already submitted your text, you can go back to the menu and wait for the others");
      }
  };
});

