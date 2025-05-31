import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
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

function updateStreakProgress(finishedCount) {
  const maxDays = Math.min(finishedCount, 5);
  const streakDays = document.querySelectorAll(".streak-row .streak-day");

  for (let i = 0; i < streakDays.length; i++) {
    if (i < maxDays) {
      streakDays[i].classList.add("checked");
    } else {
      streakDays[i].classList.remove("checked");
    }
  }

  console.log(`[DEBUG] ${finishedCount} parties finies => ${maxDays} jours cochés.`);
}

auth.onAuthStateChanged(user => {
  if (!user) {
    return;
  }

  const gamesRef = collection(db, "games");
  const q = query(gamesRef, where("playerIds", "array-contains", user.uid));

  onSnapshot(q, (snapshot) => {
    let finishedCount = 0;

    snapshot.forEach(doc => {
      const game = doc.data();
      if (game.status === "finished") {
        finishedCount++;
      }
    });

    updateStreakProgress(finishedCount);
  });
});

document.getElementById("start-challenge-btn").addEventListener("click", () => {
  window.location.href = "../game-menu.html";
});

document.querySelector(".icon-bell").addEventListener("click", () => {
  window.location.href = "../notification_reminder.html";
});

document.getElementById("badges-btn").addEventListener("click", () => {
  window.location.href = "../badges_menu.html";
});

document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = "../main-menu.html";
});

