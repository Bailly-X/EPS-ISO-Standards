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

function updateBadgeUI(daysPlayed, badgesEarned) {
  document.querySelectorAll(".badge-number")[0].textContent = daysPlayed;
  document.querySelectorAll(".badge-number")[1].textContent = badgesEarned;

  const daysFillPercentage = Math.min((daysPlayed / 10) * 100, 100);
  const badgesFillPercentage = Math.min((badgesEarned / 10) * 100, 100);
  
  document.querySelectorAll(".progress-fill")[0].style.width = daysFillPercentage + "%";
  document.querySelectorAll(".progress-fill")[1].style.width = badgesFillPercentage + "%";

  document.querySelectorAll(".progress-info")[0].textContent = `${daysPlayed}/10`;
  document.querySelectorAll(".progress-info")[1].textContent = `${badgesEarned}/10`;
}

auth.onAuthStateChanged(user => {
  if (!user) {
    return;
  }

  const gamesRef = collection(db, "games");
  const q = query(gamesRef, where("playerIds", "array-contains", user.uid));

  onSnapshot(q, (snapshot) => {
    
    let finishedCount = 0;
    const uniqueDates = new Set();

    snapshot.forEach(doc => {
      const game = doc.data();
      
      const isFinished = game.status === "finished";
      
      if (isFinished) {
        finishedCount++;
        
        let gameDate;
        if (game.createdAt) {
          if (game.createdAt.toDate) {
            gameDate = game.createdAt.toDate();
          } else if (game.createdAt.seconds) {
            gameDate = new Date(game.createdAt.seconds * 1000);
          } else {
            gameDate = new Date(game.createdAt);
          }
        } else if (game.date) {
          gameDate = new Date(game.date);
        } else {
          gameDate = new Date();
        }
        
        const dateOnly = gameDate.toDateString();
        uniqueDates.add(dateOnly);
      }
    });


    const daysPlayed = uniqueDates.size;
    const badgesEarned = finishedCount;
    
    updateBadgeUI(daysPlayed, badgesEarned);
  });
});

document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = "../main-menu.html";
});

document.querySelector(".icon-bell").addEventListener("click", () => {
  window.location.href = "../notification_reminder.html";
});