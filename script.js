const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let gameSpeed = 5;
const gravity = 0.5;

const player = {
  x: 100,
  y: 450,
  width: 50,
  height: 50,
  color: 'blue',
  velocity: 0,
  jumpForce: -10,
  grounded: false
};

const ground = {
  x: 0,
  y: 500,
  width: canvas.width,
  height: 100,
  color: 'green'
};

let obstacles = [];
let powerUps = [];
let obstacleTimer = 0;
let powerUpTimer = 0;
let obstacleInterval = 200;
let powerUpInterval = 1000;

// Handle key presses for jumping
document.addEventListener('keydown', function(event) {
  if (event.key === ' ' && player.grounded) {
    player.velocity = player.jumpForce;
    player.grounded = false;
  }
});

function updatePlayer() {
  // Apply gravity
  player.velocity += gravity;
  player.y += player.velocity;

  // Check if player is on the ground
  if (player.y + player.height > ground.y) {
    player.y = ground.y - player.height;
    player.velocity = 0;
    player.grounded = true;
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updateObstacles() {
  if (obstacleTimer > obstacleInterval) {
    const size = Math.random() * (50 - 20) + 20;
    obstacles.push({
      x: canvas.width,
      y: ground.y - size,
      width: size,
      height: size
    });
    obstacleTimer = 0;
    // Decrease interval to make the game harder over time
    obstacleInterval *= 0.99;
  } else {
    obstacleTimer++;
  }

  obstacles.forEach(obstacle => {
    obstacle.x -= gameSpeed;

    // Collision detection
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      // End game or reduce player's life
      console.log("Game Over");
      resetGame();
    }
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function updatePowerUps() {
  if (powerUpTimer > powerUpInterval) {
    powerUps.push({
      x: canvas.width,
      y: Math.random() * (ground.y - 50),
      size: 20
    });
    powerUpTimer = 0;
  } else {
    powerUpTimer++;
  }

  powerUps.forEach((powerUp, index) => {
    powerUp.x -= gameSpeed;

    // Collision detection for power-ups
    if (
      player.x < powerUp.x + powerUp.size &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.size &&
      player.y + player.height > powerUp.y
    ) {
      // Apply power-up effect
      score += 100; // Example effect: increase score
      powerUps.splice(index, 1); // Remove power-up
    }
  });

  // Remove off-screen power-ups
  powerUps = powerUps.filter(powerUp => powerUp.x + powerUp.size > 0);
}

function drawPowerUps() {
  ctx.fillStyle = 'yellow';
  powerUps.forEach(powerUp => {
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.size, powerUp.size);
  });
}

function drawGround() {
  ctx.fillStyle = ground.color;
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, canvas.width - 150, 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGround();
  updatePlayer();
  drawPlayer();
  updateObstacles();
  drawObstacles();
  updatePowerUps();
  drawPowerUps();
  drawScore();
  score++;
  gameSpeed += 0.003; // Gradually increase game speed
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  score = 0;
  gameSpeed = 5;
  obstacles = [];
  powerUps = [];
  player.y = 450;
  player.velocity = 0;
  obstacleInterval = 200;
}

requestAnimationFrame(gameLoop);
