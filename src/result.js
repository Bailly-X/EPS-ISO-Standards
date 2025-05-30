import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

function render(index) {
    if (!chains.length) return;
    const chain = chains[index];
    counter.textContent = `${index+1}/${chains.length}`;
    title.textContent = `Comparison Sentence ${index+1}`;

    const first = chain[0];
    const usernameOrig = playersById[first.uid]?.username || "Unknown";
    let html = `
        <button class="vote-btn comparison-box" data-uid="${first.uid}">
            <span class="step-username">${escapeHtml(usernameOrig)}</span>
            <div style="margin:7px 0 2px 0;font-weight:bold;">Original</div>
            <div>${escapeHtml(first.text)}</div>
        </button>
    `;

    if (stepsList.style.display !== "none" && chain.length > 2) {
        for(let i=1; i<chain.length-1; i++) {
            const step = chain[i];
            const username = playersById[step.uid]?.username || "Unknown";
            html += `
              <button class="vote-btn step-item" data-uid="${step.uid}">
                    <span class="step-username">${escapeHtml(username)}</span>
                    <div>${escapeHtml(step.text)}</div>
              </button>
            `;
        }
    }

    const last = chain[chain.length-1];
    const usernameFinal = playersById[last.uid]?.username || "Unknown";
    html += `
        <button class="vote-btn final-box" data-uid="${last.uid}">
            <span class="step-username">${escapeHtml(usernameFinal)}</span>
            <div style="margin:7px 0 2px 0;font-weight:bold;">Final</div>
            <div>${escapeHtml(last.text)}</div>
        </button>
    `;

    main.innerHTML = html;
    updateNav();
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.onclick = function() {
            const votedUid = btn.getAttribute("data-uid");
            alert("Tu veux voter pour : " + (playersById[votedUid]?.username || votedUid));
            // ICI tu mettras le vrai système de vote plus tard
        }
    });
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