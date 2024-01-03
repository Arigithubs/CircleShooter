const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameSpeed = 5;
const gravity = 0.5;
let lives = 3;
let gamePaused = false;

const player = {
  x: 100,
  y: 450,
  width: 50,
  height: 50,
  color: 'blue',
  velocity: 0,
  jumpForce: -10,
  grounded: false,
  superJump: false
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
const powerUpTypes = ['scoreBoost', 'slowDown', 'extraLife', 'superJump', 'speedBoost'];

document.addEventListener('keydown', function(event) {
  if (event.key === ' ' && player.grounded) {
    player.velocity = player.superJump ? player.jumpForce * 1.5 : player.jumpForce;
    player.grounded = false;
  } else if (event.key === 'p' || event.key === 'P') {
    gamePaused = !gamePaused;
  }
});

function updatePlayer() {
  if (gamePaused) return;

  player.velocity += gravity;
  player.y += player.velocity;

  if (player.y + player.height > ground.y) {
    player.y = ground.y - player.height;
    player.velocity = 0;
    player.grounded = true;
  }
}

function updateObstacles() {
  if (gamePaused) return;

  if (obstacleTimer > obstacleInterval) {
    const size = Math.random() * (50 - 20) + 20;
    obstacles.push({
      x: canvas.width,
      y: ground.y - size,
      width: size,
      height: size
    });
    obstacleTimer = 0;
    obstacleInterval *= 0.99;
  } else {
    obstacleTimer++;
  }

  obstacles.forEach(obstacle => {
    obstacle.x -= gameSpeed;

    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      lives--;
      if (lives <= 0) {
        resetGame();
      } else {
        obstacles = [];
      }
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
  if (gamePaused) return;

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
    ctx.fillStyle = powerUp.type === 'scoreBoost' ? 'yellow' : powerUp.type === 'slowDown' ? 'cyan' : powerUp.type === 'extraLife' ? 'pink' : powerUp.type === 'superJump' ? 'purple' : 'orange';
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.size, powerUp.size);
  });
}

function applyPowerUpEffect(type) {
  if (type === 'scoreBoost') {
    score += 100;
  } else if (type === 'slowDown') {
    gameSpeed = Math.max(2, gameSpeed - 2);
    setTimeout(() => {
      gameSpeed += 2;
    }, 3000);
  } else if (type === 'extraLife') {
    lives++;
  } else if (type === 'superJump') {
    player.superJump = true;
    setTimeout(() => {
      player.superJump = false;
    }, 5000);
  } else if (type === 'speedBoost') {
    gameSpeed += 3;
    setTimeout(() => {
      gameSpeed -= 3;
    }, 5000);
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
  ctx.fillText('Lives: ' + lives, 10, 90);
}

function drawPauseScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText('Game Paused', canvas.width / 2 - 100, canvas.height / 2);
}

function gameLoop() {
  if (gamePaused) {
    drawPauseScreen();
    requestAnimationFrame(gameLoop);
    return;
  }

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
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
  score = 0;
  gameSpeed = 5;
  lives = 3;
  obstacles = [];
  powerUps = [];
  player.y = 450;
  player.velocity = 0;
  obstacleInterval = 200;
  player.superJump = false;
  gamePaused = false;
}

requestAnimationFrame(gameLoop);
