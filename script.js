const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let highScore = 0;
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
const powerUpTypes = ['scoreBoost', 'slowDown'];

// Handle key presses for jumping
document.addEventListener('keydown', function(event) {
  if (event.key === ' ' && player.grounded) {
    player.velocity = player.jumpForce;
    player.grounded = false;
  }
});

function updatePlayer() {
  player.velocity += gravity;
  player.y += player.velocity;

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
    const type = Math.random() > 0.5 ? 'regular' : 'moving'; // 50% chance for moving obstacle
    obstacles.push({
      x: canvas.width,
      y: type === 'regular' ? ground.y - size : ground.y - size - Math.random() * 100,
      width: size,
      height: size,
      type: type,
      speed: type === 'moving' ? Math.random() * 2 - 1 : 0 // Random speed for moving obstacles
    });
    obstacleTimer = 0;
    obstacleInterval *= 0.99;
  } else {
    obstacleTimer++;
  }

  obstacles.forEach(obstacle => {
    obstacle.x -= gameSpeed;
    if (obstacle.type === 'moving') {
      obstacle.y += obstacle.speed;
      // Change direction if it hits ground or an upper limit
      if (obstacle.y + obstacle.height >= ground.y || obstacle.y <= 100) {
        obstacle.speed *= -1;
      }
    }

    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      resetGame();
    }
  });

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
      size: 20,
      type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
    });
    powerUpTimer = 0;
  } else {
    powerUpTimer++;
  }

  powerUps.forEach((powerUp, index) => {
    powerUp.x -= gameSpeed;

    if (
      player.x < powerUp.x + powerUp.size &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.size &&
      player.y + player.height > powerUp.y
    ) {
      applyPowerUpEffect(powerUp.type);
      powerUps.splice(index, 1);
    }
  });

  powerUps = powerUps.filter(powerUp => powerUp.x + powerUp.size > 0);
}

function drawPowerUps() {
  powerUps.forEach(powerUp => {
    ctx.fillStyle = powerUp.type === 'scoreBoost' ? 'yellow' : 'cyan';
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.size, powerUp.size);
  });
}

function applyPowerUpEffect(type) {
  if (type === 'scoreBoost') {
    score += 100;
  } else if (type === 'slowDown') {
    gameSpeed = Math.max(2, gameSpeed - 2); // Slow down but not less than 2
    setTimeout(() => {
      gameSpeed += 2; // Return to normal speed after 3 seconds
    }, 3000);
  }
}

function drawGround() {
  ctx.fillStyle = ground.color;
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
  ctx.fillText('High Score: ' + highScore, 10, 60);
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
  gameSpeed += 0.003;
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  highScore = Math.max(score, highScore);
  score = 0;
  gameSpeed = 5;
  obstacles = [];
  powerUps = [];
  player.y = 450;
  player.velocity = 0;
  obstacleInterval = 200;
}

requestAnimationFrame(gameLoop);
