const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const finalMessageRevealWord = document.getElementById(
  "final-message-reveal-word"
);
const definition = document.getElementById("definiton");
const hint = document.getElementById("hint");
// const easyBtn = document.getElementById("easy");

const figureParts = document.querySelectorAll(".figure-part");

let gameMode = "easy";

let words = [];
// let easy = ["dog", "cat", "house", "lake", "soda", "keyboard", "computer"];
let def = [];

let playable = true;

const correctLetters = [];
const wrongLetters = [];

async function getRandomWord() {
  const res = await fetch(`https://random-words-api.vercel.app/word`);
  // console.log(res);
  const data = await res.json();
  console.log(data[0].definition);
  const word = data[0].word.toLowerCase();
  if (!isValid(word)) {
    // console.log("Invalid Word");
    getRandomWord();
  }
  def.push(data[0].definition);
  words.push(word);

  console.log(words);
  displayWord();
}

function isValid(str) {
  return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

function displayWord() {
  console.log(words[0]);
  wordEl.innerHTML = `
    ${words[0]
      .split("")
      .map(
        (letter) => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ""}
          </span>
        `
      )
      .join("")}
  `;

  const innerWord = wordEl.innerText.replace(/[ \n]/g, "");

  if (innerWord === words[0]) {
    finalMessage.innerText = "Congratulations! You won! 😃";
    popup.style.display = "flex";

    playable = false;
  }
  def.forEach((i) => {
    definition.innerHTML = i;
  });
}

// Update the wrong letters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  // Display parts
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
    finalMessage.innerText = "Unfortunately you lost. 😕";
    finalMessageRevealWord.innerText = `...the word was: ${words[0]}`;
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

// Keydown letter press
window.addEventListener("keydown", (e) => {
  if (playable) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key.toLowerCase();

      if (words[0].includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);

          displayWord();
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

// Hint event
hint.addEventListener("click", () => {
  console.log("click");
  if (definiton.style.display === "none") {
    definiton.style.display = "block";
    hint.style.display = "none";
  } else {
    definiton.style.display = "none";
  }
});

// Restart game and play again
playAgainBtn.addEventListener("click", () => {
  playable = true;

  //  Empty arrays
  definiton.style.display = "none";
  hint.style.display = "block";
  correctLetters.splice(0);
  wrongLetters.splice(0);
  words = [];
  getRandomWord();

  updateWrongLettersEl();

  popup.style.display = "none";
});

getRandomWord();
