import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

const progressBar = document.getElementById("progressBar");
const roundCounter = document.getElementById("roundCounter");
const roundNumberInText = document.getElementById("roundNumber");
const backToMenuBtn = document.getElementById("backToMenu");

function setProgress(percent) {
  progressBar.style.setProperty("--progress", percent + "%");
}

const params = new URLSearchParams(window.location.search);
const gameId = params.get("gameId");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.warn("Nu user connected");
    return;
  }
  if (!gameId) {
    console.warn("No gameId in URL");
    return;
  }

  const gameRef = doc(db, "games", gameId);
  const snap    = await getDoc(gameRef);
  if (!snap.exists()) {
    console.error("Game not found");
    return;
  }
  const game = snap.data();

  const rounds      = Array.isArray(game.rounds) ? game.rounds : [];
  const totalRounds = Math.max(1, rounds.length);
  const current     = typeof game.currentRound === "number"
                      ? game.currentRound
                      : 1;

  roundCounter.textContent      = `${current}/${totalRounds}`;
  setProgress(Math.round(100 * current / totalRounds));
  roundNumberInText.textContent = String(current);
});

backToMenuBtn.addEventListener("click", () => {
  window.location.href = "./main-menu.html";
});