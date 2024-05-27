const letters = document.querySelectorAll(".box");
console.log(letters);
const ASNWER_LENGTH = 5;

async function init() {
  let currentGuesss = "";

  function addLetter(letter) {
    if (currentGuesss.length < ASNWER_LENGTH) {
      currentGuesss += letter;
    } else {
      currentGuesss =
        currentGuesss.substring(0, currentGuesss.length - 1) + letter;
    }

    letters[currentGuesss.length - 1].innerText = letter;
  }

  document.addEventListener("keydown", function handleKeyPress(event) {
    const action = event.key;
    console.log(action);

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

init();
