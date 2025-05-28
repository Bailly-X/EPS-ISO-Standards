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

const gameListContainer = document.getElementById("games-list");

function renderGameButton(game, docId, currentUserId) {
  const others = game.players.filter(p => p.uid !== currentUserId);
  const othersNames = others.map(p => p.username).join(", ") || "Unknown";
  const statusTxt = game.status === "waiting" ? "Waiting..." : (game.status || "");

  return `
    <button class="join-game-btn" data-gameid="${docId}" style="
      display: block;
      width: 100%;
      padding: 18px 0;
      margin: 16px 0;
      font-size: 1.25em;
      font-weight: bold;
      border-radius: 16px;
      border: 2px solid #5b16f5;
      background: #f8f7ff;
      color: #5b16f5;
      cursor: pointer;
      box-shadow: 0 2px 10px #e3e0ff66;
      transition: background 0.2s, color 0.2s;
    ">
      Game with : ${othersNames} — <span style="font-size:.85em;font-weight:normal">${statusTxt}</span>
    </button>
  `;
}

auth.onAuthStateChanged(user => {
  if (!user) {
    console.log("Utilisateur non connecté !");
    return;
  }
  console.log("User connecté :", user.uid);
  const gamesRef = collection(db, "games");
  const q = query(gamesRef, where("playerIds", "array-contains", user.uid));
  onSnapshot(q, (snapshot) => {
    gameListContainer.innerHTML = "";
    snapshot.forEach(doc => {
      const game = doc.data();
      gameListContainer.innerHTML += renderGameButton(game, doc.id, user.uid);
    });
    document.querySelectorAll(".join-game-btn").forEach(btn => {
      btn.onclick = (e) => {
        const gameId = btn.getAttribute("data-gameid");
        localStorage.setItem("currentGameId", gameId);
        window.location.href = "./chose-text.html?gameId=" + gameId;
      }
    });
  });
});