const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById(
  "final-message-reveal-word"
);

const figureParts = document.querySelectorAll(".figure-part");

let playable = true;

const words = [];

async function getRandomWord() {
  const res = await fetch(`https://random-words-api.vercel.app/word`);
  // console.log(res);
  const data = await res.json();
  words.push(data[0].word.toLowerCase());
  // console.log(words);
  selectedWords();
}

function selectedWords() {
  let selectedWord = words[Math.floor(Math.random() * words.length)];
  if (!isValid(selectedWord)) {
    console.log("Invalid Word");
    getRandomWord();
  }
  console.log(selectedWord);
  displayWord(selectedWord);
}

function isValid(str) {
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

const correctLetters = [];
console.log(correctLetters);
const wrongLetters = [];

function displayWord(selectedWord) {
  console.log(selectedWord);
  wordEl.innerHTML = `${selectedWord
    .split("")
    .map(
      (letter) =>
        `<span class="letter">${
          correctLetters.includes(letter) ? letter : ""
        }</span>`
    )
    .join("")}`;

  const innerWord = wordEl.innerText.replace(/\n/g, "");
  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congrats! You Won!!";
    popup.style.display = "flex";

    playable = false;
  }
}

// Update wrong letters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  // Displays parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });
  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost";
    popup.style.display = "flex";

    playable = false;
  }
}

// Show notification
function showNotification() {
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Keydown event listener
window.addEventListener("keydown", (e) => {
  console.log(e.keyCode);
  let selectedWord = words[Math.floor(Math.random() * words.length)];
  console.log(selectedWord);
  if (playable) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key;
      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);

          displayWord(selectedWord);
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);

          updateWrongLettersEl();
        } else {
          showNotification();
        }
      }
    }
  }
});

// Restart game and play again
playAgainBtn.addEventListener("click", () => {
  playable = true;

  //  Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

  getRandomWord();
  // displayWord(selectedWord);

  updateWrongLettersEl();

  popup.style.display = "none";
});

getRandomWord();
