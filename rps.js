// ==================================================
// State (load + migrate old localStorage format)
// ==================================================

function loadScore() {
  const saved = JSON.parse(localStorage.getItem("rpsScore"));

  // Default score
  const base = { wins: 0, losses: 0, ties: 0 };

  // Nothing saved yet
  if (!saved) return base;

  // If saved in NEW format already
  if ("wins" in saved || "losses" in saved || "ties" in saved) {
    return {
      wins: Number(saved.wins) || 0,
      losses: Number(saved.losses) || 0,
      ties: Number(saved.ties) || 0,
    };
  }

  // If saved in OLD format (Wins/Losses/Ties)
  return {
    wins: Number(saved.Wins) || 0,
    losses: Number(saved.Losses) || 0,
    ties: Number(saved.Ties) || 0,
  };
}

const score = loadScore();

// ==================================================
// DOM References
// ==================================================

const resultEl = document.querySelector(".results");
const choicesEl = document.querySelector(".choices");
const scoreEl = document.querySelector(".js-score");

const rockBtn = document.getElementById("rockBtn");
const paperBtn = document.getElementById("paperBtn");
const scissorsBtn = document.getElementById("scissorsBtn");
const resetBtn = document.querySelector(".reset-btns");
const autoPlayBtn = document.querySelector(".auto-play");

// ==================================================
// Constants / Rules
// ==================================================

const MOVES = ["rock", "paper", "scissors"];
const WIN_RULES = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

// ==================================================
// Init
// ==================================================

updateScore(); // render immediately
persistScore(); // write back in NEW format (migrates automatically)

// ==================================================
// Event Listeners
// ==================================================

rockBtn.addEventListener("click", () => playGame("rock"));
paperBtn.addEventListener("click", () => playGame("paper"));
scissorsBtn.addEventListener("click", () => playGame("scissors"));

resetBtn.addEventListener("click", resetScore);
autoPlayBtn.addEventListener("click", toggleAutoPlay);

// ==================================================
// Game Logic
// ==================================================

function pickComputerMove() {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function playGame(playerMove) {
  const computerMove = pickComputerMove();
  const result = getResult(playerMove, computerMove);

  updateState(result);
  renderResult(result, playerMove, computerMove);
  updateScore();
  persistScore();
}

function getResult(player, computer) {
  if (player === computer) return "tie";
  if (WIN_RULES[player] === computer) return "win";
  return "loss";
}

function updateState(result) {
  if (result === "win") score.wins += 1;
  if (result === "loss") score.losses += 1;
  if (result === "tie") score.ties += 1;
}

// ==================================================
// Rendering
// ==================================================

function renderResult(result, playerMove, computerMove) {
  const messages = {
    win: "You Win 🎉",
    loss: "You Lose ❌",
    tie: "It's a Tie 🤝",
  };

  resultEl.textContent = messages[result];

  choicesEl.innerHTML = `
    You:
    <img class="move-img" src="/RPS-Game/images/${playerMove}-emoji.png" alt="${playerMove}">
    Computer:
    <img class="move-img" src="/RPS-Game/images/${computerMove}-emoji.png" alt="${computerMove}">
  `;
}

function updateScore() {
  scoreEl.textContent = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

// ==================================================
// Persistence
// ==================================================

function persistScore() {
  localStorage.setItem("rpsScore", JSON.stringify(score));
}

// ==================================================
// Reset
// ==================================================

function resetScore() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;

  localStorage.removeItem("rpsScore");

  updateScore();
  resultEl.textContent = "";
  choicesEl.innerHTML = "";
}

// ==================================================
// Auto Play
// ==================================================

let autoPlayInterval = null;

function toggleAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    autoPlayBtn.textContent = "Auto Play";
    return;
  }

  autoPlayInterval = setInterval(() => {
    playGame(pickComputerMove());
  }, 1000);

  autoPlayBtn.textContent = "Stop Auto Play";
}
