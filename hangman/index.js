// Data
const theWord = words[random(0, words.length-1)];
const guesses = [];
const buttons = 'abcdefghijklmnopqrstuvwxyz';
const MAX_BAD_GUESSES = 9;
const GameState = {
  INGAME: 0,
  WON: 1,
  LOST: 2,
}
let gameState = GameState.INGAME;

// Utility function
function random(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// Game functions
function badAttempts(theWord, guesses) {
  return guesses
    .filter(guess => !theWord.includes(guess))
    .length;
}
function isLost(theWord, guesses, MAX_BAD_GUESSES) {
  return badAttempts(theWord, guesses) === MAX_BAD_GUESSES;
}
function isWon(theWord, guesses) {
  return theWord.split('').every(c => guesses.includes(c))
}

// Elements
const divWord = document.querySelector("#the-word");
const divLetters = document.querySelector("#letters");
const divScore = document.querySelector("#score");
const divEndOfGame = document.querySelector("#end-of-game");

// Generators
function genWord(theWord, guesses, gameState) {
  return theWord
    .split('')
    .map(c => `<span
      ${!guesses.includes(c) && gameState === GameState.LOST ? 'class="missing"' : ""}
    >${guesses.includes(c) || gameState === GameState.LOST ? c : ''}</span>`)
    .join('')
}

function genLetter(buttons) {
  return buttons.split('').map(c => `<button>${c}</button>`).join('')
}
function genScore(theWord, guesses) {
  return `Score: ${badAttempts(theWord, guesses)}/${MAX_BAD_GUESSES}`;
}
function genEndOfGame(gameState) {
  return `
    <span>${gameState === GameState.WON ? "You win!" : "You lose!"}</span>
    <button>Play again!</button>
  `;
}

// Event handlers
divLetters.addEventListener('click', function (e) {
  if (e.target.matches('button')) {
    // read
    const letter = e.target.innerHTML;
    // console.log(letter);
    // process
    guesses.push(letter);
    if (isLost(theWord, guesses, MAX_BAD_GUESSES)) {
      gameState = GameState.LOST;
    }
    if (isWon(theWord, guesses)) {
      gameState = GameState.WON;
    }
    // write
    // declarative
    divWord.innerHTML = genWord(theWord, guesses, gameState)
    divScore.innerHTML = genScore(theWord, guesses);
    // divLetters.innerHTML = genLetter(buttons)
    // imperative
    e.target.disabled = true;

    const svgEl = document.querySelector(`svg *:nth-child(${badAttempts(theWord, guesses)})`)
    svgEl?.classList.add('show')

    if (gameState !== GameState.INGAME) {
      divEndOfGame.hidden = false;
      divEndOfGame.innerHTML = genEndOfGame(gameState);
    }
    if (gameState === GameState.WON) {
      divWord.classList.add('won');
    }
  }
})
divEndOfGame.addEventListener('click', function (e) {
  if (e.target.matches('button')) {
    window.location.reload();
  }
})

// onLoad
divWord.innerHTML = genWord(theWord, guesses, gameState)
divLetters.innerHTML = genLetter(buttons)