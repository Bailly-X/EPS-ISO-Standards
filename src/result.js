import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

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

const main = document.getElementById("comparison-main");
const stepsList = document.getElementById("steps-list");
const seeStepsBtn = document.getElementById("see-steps-btn");
const counter = document.getElementById("comparison-counter");
const title = document.getElementById("comparison-title");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

let chains = [];
let playersById = {};
let current = 0;
let votes = {};
let userVotes = {};
let userUid = null;
let unsubscribe = null;

document.getElementById("backButton").addEventListener("click", () => {
  window.location.href = "./main-menu.html";
});

function listenGameRealtime() {
  if (unsubscribe) unsubscribe();

  const gameRef = doc(db, "games", gameId);
  unsubscribe = onSnapshot(gameRef, (snap) => {
    if (!snap.exists()) {
      main.innerHTML = "<div>Game not found</div>";
      return;
    }
    const game = snap.data();
    playersById = {};
    (game.players || []).forEach(p => playersById[p.uid] = p);
    votes = game.votes || {};
    userVotes = game.userVotes || {};
    const rounds = game.rounds || [];
    const initialUids = Object.keys(rounds[0]?.texts || {});
    chains = initialUids.map(uid => buildChainForInitialUid(uid, rounds));
    render(current);
  });
}

onAuthStateChanged(auth, user => {
    if (user) {
        userUid = user.uid;
        listenGameRealtime();
    } else {
        main.innerHTML = "You need to be loged in to vote.";
    }
});

function buildChainForInitialUid(initialUid, rounds) {
    const chain = [{
        uid: initialUid,
        text: rounds[0].texts[initialUid],
        type: 'original'
    }];
    let currentSource = initialUid;
    for (let r = 1; r < rounds.length; r++) {
        const answers = rounds[r]?.answers || {};
        let foundUid = null;
        let foundAnswer = null;
        for (const [uid, ans] of Object.entries(answers)) {
            if (ans.source === currentSource) {
                foundUid = uid;
                foundAnswer = ans;
                break;
            }
        }
        if (!foundUid) break;
        chain.push({
            uid: foundUid,
            text: foundAnswer.text,
            type: 'step'
        });
        currentSource = foundUid;
    }
    if (chain.length > 1) {
        chain[chain.length - 1].type = 'final';
    }
    return chain;
}

function getVotesFor(initialId, stepUid) {
  return (votes[initialId] && votes[initialId][stepUid]) || 0;
}
function getUserVoteFor(initialId, voterUid) {
  return (userVotes[initialId] && userVotes[initialId][voterUid]) || null;
}

function getMaxVotedStep(initialId) {
  if (!votes[initialId]) return null;
  let max = 0, maxUid = null;
  Object.entries(votes[initialId]).forEach(([uid, n]) => {
    if (n > max) {
      max = n;
      maxUid = uid;
    }
  });
  return maxUid;
}

function render(index) {
  if (!chains.length) return;
  const chain = chains[index];
  const initialId = chain[0].uid;

  const userVotedStep = getUserVoteFor(initialId, userUid);
  const maxVotedStep = getMaxVotedStep(initialId);

  counter.textContent = `${index+1}/${chains.length}`;
  title.textContent = `Comparison Sentence ${index+1}`;

  let html = "";
  const first = chain[0];
  const usernameOrig = playersById[first.uid]?.username || "Unknown";
  html += `
    <div class="comparison-box">
      <span class="step-username">${escapeHtml(usernameOrig)}</span>
      <div style="margin:7px 0 2px 0;font-weight:bold;">Original</div>
      <div>${escapeHtml(first.text)}</div>
    </div>
  `;

  for(let i=1; i<chain.length; i++) {
    const step = chain[i];
    const username = playersById[step.uid]?.username || "Unknown";
    const votesN = getVotesFor(initialId, step.uid);
    const isVoted = (userVotedStep === step.uid);
    const isWinner = (maxVotedStep === step.uid && votesN > 0);

    html += `
      <div class="vote-step-wrap">
        <span class="votes-count-top">${votesN} vote${votesN > 1 ? "s" : ""}</span>
        <button class="vote-btn step-item ${isVoted ? "voted" : ""} ${isWinner ? "winner" : ""}" 
          data-uid="${step.uid}" data-initial="${initialId}">
            ${isWinner ? '<img src="./assets/badges.png" class="winner-badge-img" alt="Winner">' : ''}
            <span class="step-username">${escapeHtml(username)}</span>
            <div>${escapeHtml(step.text)}</div>
        </button>
      </div>
    `;
  }

  main.innerHTML = html;

  document.querySelectorAll('.vote-btn.step-item').forEach(btn => {
    btn.onclick = async function() {
      const stepUid = btn.getAttribute("data-uid");
      const initialId = btn.getAttribute("data-initial");

      if (getUserVoteFor(initialId, userUid)) {
        alert("You already voted for this text.");
        return;
      }

        if (!votes[initialId]) votes[initialId] = {};
        votes[initialId][stepUid] = (votes[initialId][stepUid] || 0) + 1;

        if (!userVotes[initialId]) userVotes[initialId] = {};
        userVotes[initialId][userUid] = stepUid;

        const gameRef = doc(db, "games", gameId);
        await updateDoc(gameRef, {
        [`votes.${initialId}.${stepUid}`]: votes[initialId][stepUid],
        [`userVotes.${initialId}.${userUid}`]: stepUid
        });

      render(index);
    }
  });

  updateNav();
}

function updateNav() {
    prevBtn.disabled = (current === 0);
    nextBtn.disabled = (current === chains.length-1);
}

function escapeHtml(txt) {
    return txt.replace(/[&<>"]/g, c => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"
    }[c]));
}

prevBtn.onclick = () => { current--; render(current); }
nextBtn.onclick = () => { current++; render(current); }

seeStepsBtn.onclick = () => {
    const show = stepsList.style.display === "none";
    stepsList.style.display = show ? "block" : "none";
    document.getElementById("arrow").innerHTML = show ? "&#8593;" : "&#8595;";
    render(current);
};

window.addEventListener("DOMContentLoaded", async () => {
    if (!gameId) {
        main.innerHTML = "<div>Missing game id</div>";
        return;
    }
    const gameRef = doc(db, "games", gameId);
    const snap = await getDoc(gameRef);
    if (!snap.exists()) {
        main.innerHTML = "<div>Game not found</div>";
        return;
    }
    const game = snap.data();
    playersById = {};
    (game.players || []).forEach(p => playersById[p.uid] = p);
    const rounds = game.rounds || [];
    if (!Array.isArray(rounds) || !rounds[0] || !rounds[0].texts) {
        main.innerHTML = "<div>No results to display (missing initial texts).</div>";
        return;
    }
    const initialUids = Object.keys(rounds[0]?.texts || {});
    chains = initialUids.map(uid => buildChainForInitialUid(uid, rounds));
    render(0);
});