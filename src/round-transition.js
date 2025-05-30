import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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

const roundIndicator = document.getElementById("round-indicator");
const roundTitle = document.getElementById("round-title");
const roundInstruction = document.getElementById("round-instruction");
const progressBar = document.getElementById("round-progress-bar");

function setProgressBar(percent) {
  progressBar.style.setProperty("--progress", percent + "%");
}

const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");

auth.onAuthStateChanged(async (user) => {
  if (!user || !gameId) return;
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  if (!gameSnap.exists()) return;

  const game = gameSnap.data();
  const roundNumber = (typeof game.currentRound === "number" ? game.currentRound : 0);
  const totalRounds = 3;

  roundIndicator.textContent = `${roundNumber}/${totalRounds}`;
  setProgressBar(Math.round(100 * roundNumber / totalRounds));

  roundTitle.textContent = `Round ${roundNumber}`;

  let instruction = "";
  if (roundNumber === 1) {
    instruction = "You will get a text now.<br>Try to rewrite it into plain language within the given time.";
  } else {
    instruction = "Get ready for the next round!";
  }
  roundInstruction.innerHTML = instruction;

  setTimeout(() => {
    window.location.href = `./play-round.html?gameId=${gameId}&round=${game.currentRound ?? 1}`;
  }, 500);//put 6000 for 6 seconds
});