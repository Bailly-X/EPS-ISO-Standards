import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

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

function showInviteAlert(game, myIndex) {
  // Simple alert (tu peux faire mieux, genre une modal custom)
  const accept = confirm(`🚨 Nouvelle invitation !\n${game.players[0].username} t'invite à une partie.\n\nAccepter ?`);
  if (accept) {
    acceptInvitation(game.id, myIndex);
  }
}

async function acceptInvitation(gameId, myIndex) {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  if (gameSnap.exists()) {
    const data = gameSnap.data();
    data.players[myIndex].accepted = true;
    await updateDoc(gameRef, { players: data.players });
    alert("Invitation acceptée !");
  }
}

auth.onAuthStateChanged(user => {
  if (!user) return;
  onSnapshot(collection(db, "games"), (snapshot) => {
    snapshot.forEach(gameDoc => {
      const game = gameDoc.data();
      const myIndex = game.players.findIndex(p => p.uid === user.uid);
      if (myIndex === -1) return;

      // 1. Si JE SUIS LE CREATEUR, ET tout le monde a accepté, ET status==waiting => mets à jour
      if (
        user.uid === game.players[0].uid &&
        game.status === "waiting" &&
        game.players.every(p => p.accepted)
      ) {
        const gameRef = doc(db, "games", gameDoc.id);
        updateDoc(gameRef, { status: "writing" });
      }

      // 2. Redirection automatique quand status==writing (pour tout le monde)
      if (game.status === "writing") {
        const key = "entered-" + gameDoc.id;
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, "1");
          window.location.href = "./chose-text.html?gameId=" + gameDoc.id;
        }
      }
    });
  });
});

const myIndex = game.players.findIndex(p => p.uid === user.uid && p.accepted === false);
if (myIndex > 0) { // Ne PAS mettre le créateur (qui est index 0)
  const key = "invite-" + change.doc.id;
  if (!localStorage.getItem(key)) {
    showInviteAlert({ ...game, id: change.doc.id }, myIndex);
    localStorage.setItem(key, "shown");
  }
}