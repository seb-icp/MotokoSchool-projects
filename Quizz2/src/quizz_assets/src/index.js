import { Actor, HttpAgent } from "@dfinity/agent";
import {
  idlFactory as quizz_idl,
  canisterId as quizz_id,
} from "dfx-generated/quizz";

const agent = new HttpAgent();
const quizz = Actor.createActor(quizz_idl, { agent, canisterId: quizz_id });
const form = document.querySelector(".quizz-form");
const aide = document.querySelector(".help");
const note = document.querySelector(".note");
const title = document.querySelector("#titleMotoko");
const btn = document.querySelector("button");
const statsBoard = document.querySelector(".stats");
const titleNumberParticipant = document.querySelector("#numberParticipants");
const hzld = document.querySelector("#hzld");
const tokenBtn = document.querySelector("#token");
let tabStats = [];
let tableauResultat = [];
form.addEventListener("submit", submitFunction);

const user = prompt("Hello and welcome into this quizz! Enter your name");
if (user == "") {
  user = "abc"; //Fixing a bug
}

async function submitFunction(e) {
  e.preventDefault();

  aide.innerText = "Wait... A teacher canister is checking your answers! 📝";

  for (let i = 1; i < 11; i++) {
    tableauResultat.push(
      document.querySelector(`input[name="q${i}"]:checked`).value
    );
  }

  console.log(tableauResultat);
  const trueTableau = tableauResultat.map((x) => parseInt(x));
  const noteUser = await quizz.quizzFinished(user, trueTableau);
  title.innerText = "";
  aide.innerText = "";
  showMessage(noteUser);
  btn.innerHTML = "Show statistics ";
  let newBtn = document.createElement("button");
  newBtn.innerText = "Claim Tokens";
  let parentBtn = btn.parentNode;
  parentBtn.insertBefore(newBtn, btn);
  newBtn.addEventListener("click", claimToken);
  form.removeEventListener("submit", submitFunction);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    hzld.style.display = "none";
    statsBoard.style.display = "grid";
    titleNumberParticipant.style.display = "block";
  });
}
function claimToken(e) {
  e.preventDefault();
  statsBoard.style.display = "none";
  titleNumberParticipant.style.display = "none";
  hzld.style.display = "block";
  const tokenBtn = document.querySelector("#token");
  tokenBtn.addEventListener("click", transferToken);
}

async function transferToken() {
  const tokenBtn = document.querySelector("#token");
  tokenBtn.removeEventListener("click", transferToken);
  const input = document.querySelector("#name");
  console.log(input);
  console.log(input.value);
  console.log(typeof input.value);
  const val = input.value.trim();
  console.log(val);
  console.log(val.length);
  if (val.length != 63) {
    alert("This is not a correct hzld adress! Verify and try again please");
    tokenBtn.addEventListener("click", transferToken);
  } else {
    alert("Transfer is being done! Thanks for participating");
    quizz.distribute(val);
  }
  return;
}

function showMessage(noteUser) {
  if (noteUser == 0) {
    note.innerText =
      " Hmm I'm sorry it's a 0 😳 read the documentation again and come back!";
  } else if (noteUser < 3) {
    note.innerText = "I'm sure you can do better " + noteUser + "/10 🥴";
  } else if (noteUser < 6) {
    note.innerText =
      "Not bad but you can still improve! " + noteUser + "/10 🤗";
  } else if (noteUser < 9) {
    note.innerText =
      "Excellent! You are among the bests " + noteUser + "/10 👏";
  } else if (noteUser == 10) {
    note.innerText =
      "Congratulations ! You've got the best score " +
      noteUser +
      "/10" +
      " Impressive! ⭐️";
  } else {
    return;
  }
}

function sumArray(tab) {
  let count = 0;
  tab.forEach((x) => {
    count += x;
  });
  return count;
}

async function loadStats() {
  const stats = await quizz.statisticsStudents();
  console.log(stats);
  const nbPeople = sumArray(stats);
  console.log(nbPeople);
  tabStats =
    nbPeople == 0
      ? [0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0]
      : stats.map((x) => Math.round((x / nbPeople) * 100));
  console.log(tabStats);
  const tabBatons = document.querySelectorAll(".baton");
  for (let i = 0; i < 11; i++) {
    let baton = tabBatons[i];
    let text = baton.childNodes[0];
    console.log(text);
    let stat = tabStats[i];
    console.log(stat);
    let batonString = "--baton" + `${i}`;
    baton.style.setProperty(batonString, stat + "%");
    text.innerText = stat + "%";
  }
  titleNumberParticipant.innerText = `Number of participants : ${nbPeople}`;
}

loadStats();
