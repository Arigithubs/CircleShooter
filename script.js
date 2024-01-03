const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 100,
  y: 450,
  width: 50,
  height: 50,
  color: 'blue',
  gravity: 0.5,
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

const obstacles = [];
const obstacleWidth = 20;
const obstacleHeight = 50;
let obstacleTimer = 0;
let obstacleInterval = 200; // Adjust this to make the game easier or harder

// Handle key presses for jumping
document.addEventListener('keydown', function(event) {
  if (event.key === ' ' && player.grounded) {
    player.velocity = player.jumpForce;
    player.grounded = false;
  }
});

function updatePlayer() {
  // Apply gravity
  player.velocity += player.gravity;
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
  // Add new obstacles
  if (obstacleTimer > obstacleInterval) {
    obstacles.push({
      x: canvas.width,
      y: ground.y - obstacleHeight,
      width: obstacleWidth,
      height: obstacleHeight
    });
    obstacleTimer = 0;
  } else {
    obstacleTimer++;
  }

  // Move and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    obstacle.x -= 5; // Speed of obstacles

    // Collision detection
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      // End game or reduce player's life
      console.log("Game Over");
    }
  }

  // Remove off-screen obstacles
  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function drawObstacles() {
  ctx.fillStyle = 'red';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function drawGround() {
  ctx.fillStyle = ground.color;
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGround();
  updatePlayer();
  drawPlayer();
  updateObstacles();
  drawObstacles();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
