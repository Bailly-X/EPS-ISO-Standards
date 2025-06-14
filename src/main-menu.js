import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

console.log("oui")

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

// Variables pour stocker l'état précédent
let lastKnownDaysCount = 0;
let lastFinishedGames = new Set(); // Pour tracker les IDs des jeux terminés
let isFirstLoad = true; // Flag pour détecter le premier chargement
let shownBadges = new Set(); // Pour tracker les badges déjà affichés

// Charger les badges déjà affichés depuis le stockage local
function loadShownBadges() {
  const stored = localStorage.getItem('shownBadges');
  if (stored) {
    shownBadges = new Set(JSON.parse(stored));
  }
}

function saveShownBadges() {
  localStorage.setItem('shownBadges', JSON.stringify([...shownBadges]));
}

function updateStreakProgress(uniqueDaysCount) {
  const maxDays = Math.min(uniqueDaysCount, 7); // 7 jours au lieu de 5
  const streakDays = document.querySelectorAll(".streak-row .streak-day");

  for (let i = 0; i < streakDays.length; i++) {
    if (i < maxDays) {
      streakDays[i].classList.add("checked");
    } else {
      streakDays[i].classList.remove("checked");
    }
  }

}

function showBadgePopup(daysCount) {
  if (shownBadges.has(daysCount)) {
    console.log(`[DEBUG] Badge pour ${daysCount} jours déjà affiché, skip`);
    return;
  }
  const popup = document.createElement('div');
  popup.className = 'badge-popup-overlay';
  popup.innerHTML = `
    <div class="badge-popup">
      <h2>Congratulations!</h2>
      <p>You earned a new batch!</p>
      <div class="badge-icon">
        <div class="badge-number">${daysCount}</div>
      </div>
      <p class="badge-description">Playing ${daysCount} days in a row</p>
      <button id="receive-badge-btn" class="receive-badge-btn">Receive Batch</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Gérer le clic sur le bouton
  document.getElementById('receive-badge-btn').addEventListener('click', () => {
    popup.remove();
    // Marquer ce badge comme affiché
    shownBadges.add(daysCount);
    saveShownBadges();
  });

  console.log(`[DEBUG] Popup affichée pour ${daysCount} jours`);
}

function checkForNewDay(currentDaysCount, currentFinishedGames) {
  console.log(`[DEBUG] Comparaison: ancien=${lastKnownDaysCount}, nouveau=${currentDaysCount}`);
  console.log(`[DEBUG] Anciens jeux terminés:`, Array.from(lastFinishedGames));
  console.log(`[DEBUG] Nouveaux jeux terminés:`, Array.from(currentFinishedGames));
  
  // Vérifier s'il y a de nouveaux jeux terminés
  const newFinishedGames = [...currentFinishedGames].filter(gameId => !lastFinishedGames.has(gameId));
  console.log(`[DEBUG] Jeux nouvellement terminés:`, newFinishedGames);
  
  // Si c'est un nouveau jour ET qu'il y a un nouveau jeu terminé
  // OU si c'est le premier chargement et qu'il y a des jeux terminés
  if ((currentDaysCount > lastKnownDaysCount && newFinishedGames.length > 0) || 
      (isFirstLoad && currentDaysCount > 0 && currentFinishedGames.size > 0)) {
    console.log(`[DEBUG] Nouveau jour détecté avec nouveau jeu terminé! Affichage de la popup`);
    showBadgePopup(currentDaysCount);
  }
  
  // Mettre à jour les compteurs
  lastKnownDaysCount = currentDaysCount;
  lastFinishedGames = new Set(currentFinishedGames);
  isFirstLoad = false; // Marquer que le premier chargement est terminé
}

// Charger les badges déjà affichés au démarrage
loadShownBadges();

auth.onAuthStateChanged(user => {
  if (!user) {
    return;
  }

  const gamesRef = collection(db, "games");
  const q = query(gamesRef, where("playerIds", "array-contains", user.uid));

  onSnapshot(q, (snapshot) => {
    console.log(`📊 Total games fetched: ${snapshot.size}`);
    
    const uniqueDates = new Set();
    const finishedGameIds = new Set();

    snapshot.forEach(doc => {
      const game = doc.data();
      console.log(`🎮 Game ID: ${doc.id}, Status: ${game.status}`);
      
      if (game.status === "finished") {
        finishedGameIds.add(doc.id);
        
        // Récupérer la date du jeu
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
          console.log("⚠️ No date field found, using current date as fallback");
        }
        
        const dateOnly = gameDate.toDateString();
        uniqueDates.add(dateOnly);
        console.log(`✅ Finished game found! ID: ${doc.id}, Date: ${dateOnly}`);
      }
    });

    const uniqueDaysCount = uniqueDates.size;
    console.log(`📅 Unique dates found:`, Array.from(uniqueDates));
    console.log(`📊 Total unique days played: ${uniqueDaysCount}`);
    console.log(`🎯 Finished game IDs:`, Array.from(finishedGameIds));

    // Vérifier s'il y a un nouveau jour avec un nouveau jeu terminé
    checkForNewDay(uniqueDaysCount, finishedGameIds);
    
    // Mettre à jour l'affichage du streak
    updateStreakProgress(uniqueDaysCount);
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

document.getElementById("tuto-btn").addEventListener("click", () => {
  window.location.href = "../tuto_plainlanguage.html";
});