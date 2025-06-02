
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, addDoc, Timestamp, doc, getDoc } from "firebase/firestore";
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

document.getElementById("backArrow").addEventListener("click", () => {
  window.location.href = "./main-menu.html";
});

const friendListEl = document.querySelector('.friend-list');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const inviteBtn = document.querySelector('.invite-btn');

let allUsers = [];
let selectedUsers = new Set();

async function loadUsers(search = "") {
  let q = collection(db, "users");
  
  friendListEl.innerHTML = "Loading...";
  if (search.trim()) {
    q = query(q, where("username", ">=", search), where("username", "<=", search + '\uf8ff'));
  }
  const querySnapshot = await getDocs(q);

  allUsers = [];
  querySnapshot.forEach((doc) => {
    allUsers.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  renderUserList();
}

function renderUserList() {
  if (!allUsers.length) {
    friendListEl.innerHTML = "<div>No users found.</div>";
    return;
  }

  friendListEl.innerHTML = "";
  allUsers.forEach(user => {
    const el = document.createElement("div");
    el.className = "friend-item" + (selectedUsers.has(user.id) ? " selected" : "");
    el.innerHTML = `
      <span class="friend-icon">&#128100;</span>
      <span class="friend-username">${user.username}</span>
      ${selectedUsers.has(user.id) ? '<span class="checkmark">&#10003;</span>' : ""}
    `;
    el.addEventListener('click', () => toggleSelect(user.id));
    friendListEl.appendChild(el);
  });
}

function toggleSelect(userId) {
  if (selectedUsers.has(userId)) {
    selectedUsers.delete(userId);
  } else {
    selectedUsers.add(userId);
  }
  renderUserList();
}

// manage the research
searchBtn.addEventListener("click", () => {
  loadUsers(searchInput.value);
});
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    loadUsers(searchInput.value);
  }
});

// loadUsers when loading the page
window.addEventListener("DOMContentLoaded", () => {
  loadUsers();
});

// invite user selected
inviteBtn.addEventListener("click", async () => {
  if (selectedUsers.size === 0) {
    alert("Select at least one friend!");
    return;
  }

  const invitedPlayers = allUsers.filter(user => selectedUsers.has(user.id)).map(user => ({
    uid: user.id,
    username: user.username,
  }));

  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert("You need to be logged in!");
    return;
  }

  let creatorUsername = currentUser.email;
  try {
    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (userDoc.exists()) {
      creatorUsername = userDoc.data().username || currentUser.email;
    }
  } catch (e) {
  }

  const creator = {
    uid: currentUser.uid,
    username: creatorUsername,
  };

const playerIds = [currentUser.uid, ...invitedPlayers.map(p => p.uid)];

  try {
    const docRef = await addDoc(collection(db, "games"), {
      players: [creator, ...invitedPlayers],
      playerIds,
      status: "waiting",
      createdAt: Timestamp.now(),
      rounds: [],
      currentRound: 0
  });
  alert("Game created! You are gonna be redirected to the main menu");
  window.location.href = "./main-menu.html";
  } catch (e) {
    alert("Failed to create the game: " + e.message);
  }
});

