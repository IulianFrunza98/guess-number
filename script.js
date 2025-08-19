// DOM ELEMENTS
const secretNumDisplay = document.querySelector("#secretNumber");
const statusDisplay = document.querySelector("#statusMessage");
const statusContainer = document.querySelector(".status");
const scoreDisplayEl = document.querySelector("#score");
const highscoreDisplayEl = document.querySelector("#highscore");
const guessInputEl = document.querySelector("#guessNumber");
const triesLimitDisplay = document.querySelector("#triesLimit");
const checkBtnEl = document.querySelector("#check-btn");
const resetBtnEl = document.querySelector("#reset-btn");

// GAME VARIABLES
let score = 0;
let highscore = 0;
let triesLeft = 10;
let secretNum;

// INITIALIZE GAME
initializeGame();

// -------------------- FUNCTIONS -------------------- //

// Initialize or reset the game
function initializeGame() {
  secretNum = generateSecretNumber();
  score = 0;
  triesLeft = 10;
  highscore = Number(localStorage.getItem("highscore")) || 0;

  updateScoreDisplay();
  highscoreDisplayEl.textContent = `Highscore: ${highscore}`;
  secretNumDisplay.textContent = "?";
  guessInputEl.value = "";
  triesLimitDisplay.textContent = triesLeft;

  checkBtnEl.disabled = false;
  guessInputEl.disabled = false;
  statusDisplay.textContent = "Start guessing...";
  setStatusColor("neutral");
}

// Generate random secret number between 1 and 20
function generateSecretNumber() {
  return Math.floor(Math.random() * 20) + 1;
}

// Validate user input
function validateInput(value) {
  if (!value || value < 1 || value > 20) {
    statusDisplay.textContent = "⛔ Enter a number between 1 and 20!";
    setStatusColor("neutral");
    return false;
  }
  return true;
}

// Update score and highscore
function updateScoreDisplay() {
  scoreDisplayEl.textContent = `Score: ${score}`;
  if (score > highscore) {
    highscore = score;
    highscoreDisplayEl.textContent = `Highscore: ${highscore}`;
    localStorage.setItem("highscore", highscore);
  }
}

// Update remaining tries
function updateTries() {
  triesLeft--;
  triesLimitDisplay.textContent = triesLeft;
  if (triesLeft <= 0) {
    statusDisplay.textContent =
      "You exceeded the try limits 😥. Press Try Again!";
    setStatusColor("neutral");
    checkBtnEl.disabled = true;
    guessInputEl.disabled = true;
    return false;
  }
  return true;
}

// Set status container color based on state
function setStatusColor(state) {
  statusContainer.className = "status " + state; // replaces any previous class
}

// Reset secret number after a correct guess
function resetSecretNumber() {
  secretNum = generateSecretNumber();
  secretNumDisplay.textContent = "?";
  statusDisplay.textContent = "Try again!";
  triesLeft = 10;
  triesLimitDisplay.textContent = triesLeft;
  setStatusColor("neutral");
  guessInputEl.value = "";
  guessInputEl.focus();
}

// Handle the guess check
function handleCheckNum() {
  const userValue = Number(guessInputEl.value);

  if (!validateInput(userValue)) return;

  if (userValue !== secretNum) {
    statusDisplay.textContent =
      userValue > secretNum ? "📈 Too high!" : "📉 Too low!";
    setStatusColor(userValue > secretNum ? "too-high" : "too-low");
    if (!updateTries()) return;
  } else {
    score++;
    updateScoreDisplay();
    statusDisplay.textContent = "🎉 You guessed it!";
    secretNumDisplay.textContent = secretNum;
    setStatusColor("correct");

    setTimeout(resetSecretNumber, 2000);
  }
}

// -------------------- EVENT LISTENERS -------------------- //
checkBtnEl.addEventListener("click", handleCheckNum);
resetBtnEl.addEventListener("click", initializeGame);

guessInputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleCheckNum();
});
