const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("message");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const restartButton = document.getElementById("restart-button");

const tileSize = 24;
const tileCount = canvas.width / tileSize;
const startSnake = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 }
];

let snake = [];
let apple = { x: 14, y: 10 };
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let gameTimer = null;
let isRunning = false;
let isGameOver = false;

function resetGame() {
  snake = startSnake.map((part) => ({ ...part }));
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  isRunning = false;
  isGameOver = false;
  placeApple();
  updateScore();
  showMessage("Press Start", "Use the arrow keys to move.");
  draw();
}

function startGame() {
  if (isRunning) {
    return;
  }

  if (isGameOver) {
    resetGame();
  }

  isRunning = true;
  hideMessage();
  gameTimer = setInterval(moveSnake, 115);
}

function pauseGame() {
  if (!isRunning) {
    return;
  }

  clearInterval(gameTimer);
  isRunning = false;
  showMessage("Paused", "Press Start to keep playing.");
}

function restartGame() {
  clearInterval(gameTimer);
  resetGame();
  startGame();
}

function moveSnake() {
  direction = nextDirection;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (hitWall(head) || hitSnake(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score += 1;
    updateScore();
    placeApple();
  } else {
    snake.pop();
  }

  draw();
}

function hitWall(head) {
  return head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
}

function hitSnake(head) {
  return snake.some((part) => part.x === head.x && part.y === head.y);
}

function placeApple() {
  do {
    apple = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some((part) => part.x === apple.x && part.y === apple.y));
}

function draw() {
  drawBoard();
  drawApple();
  drawSnake();
}

function drawBoard() {
  ctx.fillStyle = "#e8eadf";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#d2d8ca";
  ctx.lineWidth = 1;

  for (let position = 0; position <= canvas.width; position += tileSize) {
    ctx.beginPath();
    ctx.moveTo(position, 0);
    ctx.lineTo(position, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, position);
    ctx.lineTo(canvas.width, position);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#173e34" : "#255c4d";
    drawTile(part.x, part.y, 3);
  });
}

function drawApple() {
  const centerX = apple.x * tileSize + tileSize / 2;
  const centerY = apple.y * tileSize + tileSize / 2;

  ctx.fillStyle = "#d93434";
  ctx.beginPath();
  ctx.arc(centerX, centerY, tileSize * 0.36, 0, Math.PI * 2);
  ctx.fill();
}

function drawTile(x, y, gap) {
  ctx.fillRect(
    x * tileSize + gap,
    y * tileSize + gap,
    tileSize - gap * 2,
    tileSize - gap * 2
  );
}

function updateScore() {
  scoreElement.textContent = score;
}

function endGame() {
  clearInterval(gameTimer);
  isRunning = false;
  isGameOver = true;
  showMessage("Game Over", `Final score: ${score}. Press Restart to play again.`);
}

function showMessage(title, text) {
  messageElement.classList.remove("is-hidden");
  messageElement.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
}

function hideMessage() {
  messageElement.classList.add("is-hidden");
}

function changeDirection(newDirection) {
  const isOpposite =
    newDirection.x + direction.x === 0 &&
    newDirection.y + direction.y === 0;

  if (!isOpposite) {
    nextDirection = newDirection;
  }
}

document.addEventListener("keydown", (event) => {
  const controls = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  };

  if (controls[event.key]) {
    event.preventDefault();
    changeDirection(controls[event.key]);
    startGame();
  }
});

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", pauseGame);
restartButton.addEventListener("click", restartGame);

resetGame();
