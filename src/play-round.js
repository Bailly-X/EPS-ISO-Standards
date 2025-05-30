import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
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

const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");
const roundIndex = Number(urlParams.get("round") ?? 1);

const roundNumberDiv = document.getElementById("roundNumber");
const roundTitle = document.getElementById("roundTitle");
const givenTextDiv = document.getElementById("givenText");
const plainTextInput = document.getElementById("plainTextInput");
const submitBtn = document.getElementById("submitBtn");

function isGameFinished(game) {
    const totalPlayers = game.playerIds.length;
    const neededRounds = totalPlayers;
    if (!game.rounds || game.rounds.length < neededRounds) return false;
    for (let i = 1; i < neededRounds; i++) {
        const answers = game.rounds[i]?.answers || {};
        if (Object.keys(answers).length < totalPlayers) {
            return false;
        }
    }
    return true;
}

function isRoundComplete(game, roundIndex) {
    const totalPlayers = game.playerIds.length;
    const round = game.rounds?.[roundIndex];
    if (!round || !round.answers) return false;
    return Object.keys(round.answers).length === totalPlayers;
}

auth.onAuthStateChanged(async (user) => {
    if (!user || !gameId) return;
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);
    if (!gameSnap.exists()) return;
    const game = gameSnap.data();
    const totalPlayers = game.playerIds.length;
    const totalRounds = totalPlayers - 1;
    const currentRound = game.currentRound || 1;

    const players = game.playerIds;
    const myIndex = players.indexOf(user.uid);

    function getGivenTextUid(players, roundIndex, myIndex, rounds) {
        if (roundIndex === 1) {
            // 1er round après l'original : donne le texte du joueur à gauche
            return players[(myIndex - 1 + players.length) % players.length];
        } else {
            // Round suivant : qui m'a donné le texte précédent ?
            const previousRound = rounds[roundIndex - 1];
            const myUid = players[myIndex];
            const lastSource = previousRound.answers[myUid]?.source;
            return lastSource || players[(myIndex - roundIndex + players.length) % players.length];
        }
    }

    const givenUid = getGivenTextUid(players, roundIndex, myIndex, game.rounds);
    const givenText =
        roundIndex === 1
            ? game.rounds[0]?.texts?.[givenUid]
            : game.rounds[roundIndex - 1]?.answers?.[givenUid]?.text || "(Aucun texte)";
    givenTextDiv.textContent = givenText;

    const alreadySubmitted = (game.rounds?.[roundIndex]?.answers || {})[user.uid];

    if (alreadySubmitted) {
        document.getElementById("plainTextInput").value = alreadySubmitted.text;
        document.getElementById("plainTextInput").disabled = true;
        document.getElementById("submitBtn").disabled = true;
        document.getElementById("submitBtn").textContent = "Submitted";
    } else {
        document.getElementById("plainTextInput").disabled = false;
        document.getElementById("submitBtn").disabled = false;
        document.getElementById("submitBtn").textContent = "Submit";
    }
    roundNumberDiv.textContent = `Round ${roundIndex + 1}/${game.rounds.length}`;
    roundTitle.textContent = "Rewrite the text now!";

    submitBtn.onclick = async () => {
        const gameSnap = await getDoc(gameRef);
        const game = gameSnap.data();
        const alreadySubmitted = (game.rounds?.[roundIndex]?.answers || {})[user.uid];
        if (alreadySubmitted) {
            alert("You already submitted this round.");
            return;
        }
        const val = plainTextInput.value.trim();
        if (!val) {
            alert("Please write your answer");
            return;
        }
        let rounds = game.rounds || [];
        if (!rounds[roundIndex]) rounds[roundIndex] = { answers: {} };
        if (!rounds[roundIndex].answers) rounds[roundIndex].answers = {};
        rounds[roundIndex].answers[user.uid] = { source: givenUid, text: val };

        await updateDoc(gameRef, { rounds });
        const afterUpdateSnap = await getDoc(gameRef);
        const afterUpdateGame = afterUpdateSnap.data();
        if (isRoundComplete(afterUpdateGame, roundIndex)) {
            if (roundIndex < totalRounds) {
                await updateDoc(gameRef, { currentRound: roundIndex + 1 });
            } else {
                await updateDoc(gameRef, { status: "finished" });
                alert("The game is done !");
            }
        }
        plainTextInput.disabled = true;
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitted!";
        if (alreadySubmitted) {
            window.location.href = "./main-menu.html?gameId=" + gameId;
            return;
        }
    };
});