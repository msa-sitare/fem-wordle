const letters = document.querySelectorAll(".box");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;
const winner = document.querySelector(".winner");
const loser = document.querySelector(".loser");
const loserMessage = document.getElementById("loser-message");

async function init() {
  let currentRow = 0;
  let currentGuess = "";
  let isLoading = true;

  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split("");
  let done = false;
  isLoading = false;

  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess =
        currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerText =
      letter;
  }

  async function commit() {
    if (currentGuess.length != ANSWER_LENGTH) {
      return;
    }


    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        //guess the correct word in place
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--;
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
        //guess the correct word in wrong place
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
        map[guessParts[i]]--;
      } else {
        //guess wrong
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }

    currentRow++;

    if (currentGuess === word) {
      winner.classList.toggle("hidden");
      done = true;
      return;
    } else if (currentRow === ROUNDS) {
      loserMessage.innerText = `You lose, the word was ${word}`;
      loser.classList.toggle("hidden");
      done = true;
    }

    currentGuess = "";
  }

  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = "";
  }

  document.addEventListener("keydown", function handleKeyPress(event) {
    if (done || isLoading) {
      // do nothing
      return;
    }

    const action = event.key;

    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing
    }
  });
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function makeMap(array) {
  //count how many same letters are there
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }

  return obj;
}

init();
