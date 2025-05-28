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


let gameId = localStorage.getItem('currentGameId');


function showInviteAlert(game, myIndex, key) {
  const accept = confirm(`New invitation !\n${game.players[0].username} invite's you for a game.\n\nAccept ?`);
  if (accept) {
    acceptInvitation(game.id, myIndex, key);
  }
}

async function acceptInvitation(gameId, myIndex, key) {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  if (gameSnap.exists()) {
    const data = gameSnap.data();
    data.players[myIndex].accepted = true;
    await updateDoc(gameRef, { players: data.players });
    console.log("updateDoc envoyé");
    const verif = await getDoc(gameRef);
    console.log("Etat du doc MAJ :", verif.data().players);
  }
}

auth.onAuthStateChanged(user => {
  if (!user) return;
  onSnapshot(collection(db, "games"), (snapshot) => {
    snapshot.forEach(gameDoc => {
      const game = gameDoc.data();
      const myIndex = game.players.findIndex(p => p.uid === user.uid);
      const gameRef = doc(db, "games", gameDoc.id);
      if (myIndex === -1) return; // Je ne suis pas concerné par cette partie

      // Afficher l'invite si je ne l'ai pas encore acceptée
      if (myIndex > 0 && !game.players[myIndex].accepted) {
        const key = "invite-" + gameDoc.id;
        if (!localStorage.getItem(key)) {
          showInviteAlert({ ...game, id: gameDoc.id }, myIndex, key);
        }
      }

      // Créateur : passage à "writing" si tout le monde a accepté
      if (
          user.uid === game.players[0].uid &&
          game.status === "waiting" &&
          game.players.every(p => p.accepted)
      ) {
          if (game.status !== "writing") {
              console.log("Créateur : je passe la partie à 'writing'");
              updateDoc(gameRef, { status: "writing" });
          }
      }

      // Créateur : redirection
      if (user.uid === game.players[0].uid && game.status === "writing") {
          const key = "entered-" + gameDoc.id;
          if (!localStorage.getItem(key)) {
              localStorage.setItem(key, "0");
              window.location.href = "./chose-text.html?gameId=" + gameDoc.id;
          }
      } else if (user.uid !== game.players[0].uid && game.status === "writing") {
          console.log("[INVITE] Ne doit PAS rediriger !");
      }

      // Invités : redirection uniquement quand "started"
      if (user.uid !== game.players[0].uid && game.status === "started") {
          const key = "entered-" + gameDoc.id;
          if (!localStorage.getItem(key)) {
              localStorage.setItem(key, "1");
              //window.location.href = "./chose-text.html?gameId=" + gameId;
          }
      }
    });
  });
});
