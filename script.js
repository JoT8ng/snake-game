// Define HTML elements
const board = document.getElementById('gameboard');
const instructionText = document.getElementById('instruction-text');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let enemydirection = 'down';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let enemy = [];
let state = 'single';

// Initialize enemy snake with 10 segments
for (let i = 0; i < 10; i++) {
  let pos = 5;
  enemy.push({ x: pos++, y: pos++ });
}

// Counter for delaying direction change of enemy snake
let enemyDirectionChangeCounter = 0;

// Draw game map, snake, food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawEnemy();
  drawFood();
  updateScore();
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Draw enemy
function drawEnemy() {
  enemy.forEach((segment) => {
    const enemyElement = createGameElement('div', 'enemy');
    setPosition(enemyElement, segment);
    board.appendChild(enemyElement)
  })
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      if (head.y < 1) {
        head.y = gridSize;
      }
      break;
    case 'down':
      head.y++;
      if (head.y > gridSize) {
        head.y = 1;
      }
      break;
    case 'left':
      head.x--;
      if (head.x < 1) {
        head.x = gridSize;
      }
      break;
    case 'right':
      head.x++;
      if (head.x > gridSize) {
        head.x = 1;
      }
      break;
  }

  snake.unshift(head);

  //   snake.pop();

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
  } else {
    snake.pop();
  }
}

// Move enemy snake
function moveEnemy(state, direction) {
  if (state === 'multiplayer') {
    console.log('enemy is in multiplayer mode')
    console.log(direction)
    switch (direction) {
      case 'ArrowUp':
        enemydirection = 'up';
        break;
      case 'ArrowDown':
        enemydirection = 'down';
        break;
      case 'ArrowLeft':
        enemydirection = 'left';
        break;
      case 'ArrowRight':
        enemydirection = 'right';
        break;
    }
  } else if (state === 'single') {
    console.log('enemy is in singleplayer mode')
    if (enemyDirectionChangeCounter === 0) {
      const randomDirection = Math.floor(Math.random() * 4);
      switch (randomDirection) {
        case 0: // Up
          enemydirection = 'up';
          break;
        case 1: // Down
          enemydirection = 'down';
          break;
        case 2: // Left
          enemydirection = 'left';
          break;
        case 3: // Right
          enemydirection = 'right';
          break;
      }
      enemyDirectionChangeCounter = 3; // Reset the counter
    }
    enemyDirectionChangeCounter--;
  }

  const enemyhead = { ...enemy[0] };
  switch (enemydirection) {
    case 'up':
      enemyhead.y--;
      if (enemyhead.y < 1) {
        enemyhead.y = gridSize;
      }
      break;
    case 'down':
      enemyhead.y++;
      if (enemyhead.y > gridSize) {
        enemyhead.y = 1;
      }
      break;
    case 'left':
      enemyhead.x--;
      if (enemyhead.x < 1) {
        enemyhead.x = gridSize;
      }
      break;
    case 'right':
      enemyhead.x++;
      if (enemyhead.x > gridSize) {
        enemyhead.x = 1;
      }
      break;
  }

  enemy.unshift(enemyhead);
  enemy.pop();
}

// Start game function
function startGame(state) {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    moveEnemy(state);
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    event.preventDefault();
    state = 'single'
    console.log('single player mode started')
    moveEnemy(state, event.code)
    startGame(state);
  } else if (
    (!gameStarted && event.code === 'Enter') ||
    (!gameStarted && event.key === ' ')
  ) {
    event.preventDefault();
    state = 'multiplayer'
    console.log('multiplayer mode started')
    moveEnemy(state, event.code)
    startGame(state);
  } else {
    switch (event.key) {
      case 'w':
      case 'W':
        direction = 'up';
        break;
      case 's':
      case 'S':
        direction = 'down';
        break;
      case 'a':
      case 'A':
        direction = 'left';
        break;
      case 'd':
      case 'D':
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress, moveEnemy);

function increaseSpeed() {
  //   console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  for (let i = 1; i < enemy.length; i++) {
    if (head.x === enemy[i].x && head.y === enemy[i].y){
      resetGame();
    }
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
  enemy = [];
  // Initialize enemy snake with 10 segments
  for (let i = 0; i < 10; i++) {
    let pos = 5;
    enemy.push({ x: pos++, y: pos++ });
  }
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}