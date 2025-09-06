// ==================================================
// NOTE: Score Loading 
// ==================================================

const score = JSON.parse(localStorage.getItem("rpsScore")) || {
  Wins: 0,
  Losses: 0,
  Ties: 0,
};

// NOTE: Ensure the scoreboard renders immediately on page load
updateScore();

// ==================================================
// NOTE: DOM references
// ==================================================

const gameResult = document.querySelector('.results');
const moves = document.querySelector('.choices');
const autoPlayBtn = document.querySelector('.auto-play');
const rockBtn = document.getElementById('rockBtn');
const paperBtn = document.getElementById('paperBtn');
const scissorBtn = document.getElementById('scissorsBtn');
const resetBtn = document.querySelector('.reset-btns');

// ==================================================
// NOTE: Event wiring
// ==================================================

rockBtn.addEventListener('click', ()=>{ 
  playGame('Rock');
});

paperBtn.addEventListener('click', ()=>{ 
  playGame('Paper');
});

scissorBtn.addEventListener('click', ()=>{ 
  playGame('Scissors');
});

// ==================================================
// NOTE: Computer move selection (uniform random choice)
// ==================================================
const randomComputerMoves = ["Rock", "Paper", "Scissors"];

function pickComputerMove(){
  return randomComputerMoves[Math.floor(Math.random() * randomComputerMoves.length)];
}

// ==================================================
// NOTE: Core game engine (determine outcome & update state)
// ==================================================
function playGame(move){
  let computerMove= pickComputerMove();
  let playerMove = move;
  let result = '';

  // NOTE: Compare moves and show outcome; increment score
  if(computerMove === 'Rock' && playerMove==='Scissors'){
    result = 'You [ Lose ]';
    score.Losses +=1;
  } else if (computerMove ==='Paper' && playerMove ==='Rock'){
    result = 'You [ Lose ]';
    score.Losses +=1;
  } else if (computerMove ==='Scissors' && playerMove === 'Paper'){
    result = 'You [ Lose ]';
    score.Losses +=1;
  } else if (computerMove === playerMove){
    result = `It's a [ Tie ]`;
    score.Ties +=1;
  } else{
    result = 'You [ Win ]';
    score.Wins +=1;
  }

  // NOTE: Reflect latest score & results in the DOM
  updateScore();
  gameResult.innerHTML = `${result}`;
  moves.innerHTML = `You: <img class="move-img" src="/RPS-Game/images/${playerMove}-emoji.png"> Computer:<img class="move-img" src="/RPS-Game/images/${computerMove}-emoji.png"> `

  // NOTE: Save score so page refresh keeps progress
  localStorage.setItem('rpsScore', JSON.stringify(score));
}

// ==================================================
// NOTE: Scoreboard renderer
// ==================================================
function updateScore(){
  const scoreDisplay = document.querySelector('.js-score');
  // NOTE: Keep display formatting consistent and readable
  scoreDisplay.innerHTML = `Wins: ${score.Wins}, Losses: ${score.Losses},  Ties: ${score.Ties}`;
}

// ==================================================
// NOTE: Reset flow
// ==================================================
resetBtn.addEventListener('click', resetScore);

function resetScore() {
  score.Wins = 0;
  score.Losses=0;
  score.Ties =0;

  localStorage.removeItem("rpsScore");

  updateScore();
  gameResult.innerHTML = '';
  moves.innerHTML = '';
}

// ==================================================
// NOTE: Auto-play toggle (start/stop interval rounds)
// ==================================================
let isAutoPlay = false;
let intervalId;



// ==================================================
// NOTE: Auto-play Event listener
// ==================================================

autoPlayBtn.addEventListener('click',()=>{
  autoPlay();
  if(isAutoPlay){
    autoPlayBtn.classList.add('stop-btn');
    autoPlayBtn.innerText = 'Stop Auto-play'
  } else{
    autoPlayBtn.classList.remove('stop-btn');
    autoPlayBtn.innerText = 'Auto Play'
  }
});


function autoPlay() {
  // NOTE: If OFF, start interval; if ON, stop it
  if(!isAutoPlay){
    intervalId = setInterval(() => {
      // NOTE: In auto mode, let "player" mirror the computer for continuous play
      const playerMove = pickComputerMove();
      playGame(playerMove);
    },1000);
    isAutoPlay = true;
  } else {
    clearInterval(intervalId);
    isAutoPlay = false
  };
};
