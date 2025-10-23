const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let board = ["","","","","","","","",""];
let running = true;
let isKartikTurn = false; // prevent clicks while Kartik is thinking

initializeGame();

function initializeGame(){
  cells.forEach(cell => cell.addEventListener("click", onPlayerClick));
  restartBtn.addEventListener("click", restartGame);
  statusText.textContent = "Your turn (X)";
  running = true;
  isKartikTurn = false;
}

function onPlayerClick(e){
  if (!running || isKartikTurn) return;

  const cell = e.currentTarget;
  const index = parseInt(cell.getAttribute("cellIndex"), 10);

  if (board[index] !== "") return;

  makeMove(index, "X");

  const result = checkWinner();
  if (result) {
    endGame(result);
    return;
  }

  // Now Kartik's turn
  isKartikTurn = true;
  statusText.textContent = "Kartik is thinking...";
  setTimeout(() => {
    kartikMove();
    isKartikTurn = false;

    const resAfterKartik = checkWinner();
    if (resAfterKartik) {
      endGame(resAfterKartik);
      return;
    }

    statusText.textContent = "Your turn (X)";
  }, 500);
}

function makeMove(index, symbol) {
  board[index] = symbol;
  const cell = cells[index];
  cell.textContent = symbol;
}

function kartikMove() {
  if (!running) return;

  const empty = board.map((v,i)=> v === "" ? i : null).filter(v=> v !== null);

  if (empty.length === 0) return;

  // 1) Trynna win
  for (let idx of empty) {
    const copy = board.slice();
    copy[idx] = "O";
    if (wouldWin(copy, "O")) {
      makeMove(idx, "O");
      return;
    }
  }

  // 2) Fumble player
  for (let idx of empty) {
    const copy = board.slice();
    copy[idx] = "X";
    if (wouldWin(copy, "X")) {
      makeMove(idx, "O");
      return;
    }
  }

  if (board[4] === "") {
    makeMove(4, "O");
    return;
  }

  const corners = [0,2,6,8].filter(i => board[i] === "");
  if (corners.length) {
    const pick = corners[Math.floor(Math.random()*corners.length)];
    makeMove(pick, "O");
    return;
  }

  const pick = empty[Math.floor(Math.random()*empty.length)];
  makeMove(pick, "O");
}

function wouldWin(simBoard, symbol) {
  for (let cond of winConditions) {
    const [a,b,c] = cond;
    if (simBoard[a] === symbol && simBoard[b] === symbol && simBoard[c] === symbol) {
      return true;
    }
  }
  return false;
}

function checkWinner() {
  for (let cond of winConditions) {
    const [a,b,c] = cond;
    if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  if (!board.includes("")) return "draw";
  return null;
}

function endGame(result) {
  running = false;
  if (result === "draw") {
    statusText.textContent = "Draw!";
  } else if (result === "X") {
    statusText.textContent = "You Win!";
  } else {
    statusText.textContent = "Kartik Wins!";
  }
}

function restartGame() {
  board = ["","","","","","","","",""];
  cells.forEach(c => c.textContent = "");
  running = true;
  isKartikTurn = false;
  statusText.textContent = "Your turn (X)";
}
