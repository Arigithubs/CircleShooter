// Get a reference to the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define the player object
const player = {
  x: canvas.width / 2 - 25, // X position
  y: canvas.height / 2 - 50, // Y position
  width: 50, // Width of the player
  height: 100, // Height of the player
  color: 'blue', // Color of the player
  speed: 5 // Speed of the player
};

// Listen for keydown events
document.addEventListener('keydown', function(event) {
  const key = event.key; // 'ArrowRight', 'ArrowLeft', 'ArrowUp', or 'ArrowDown'

  switch (key) {
    case 'ArrowLeft':
      // Move player left
      player.x -= player.speed;
      break;
    case 'ArrowRight':
      // Move player right
      player.x += player.speed;
      break;
    case 'ArrowUp':
      // Move player up
      player.y -= player.speed;
      break;
    case 'ArrowDown':
      // Move player down
      player.y += player.speed;
      break;
  }
});

// A function to update game objects
function update() {
  // Ensure the player stays within the canvas boundaries
  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// A function to render the game
function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player's body
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y + player.height * 0.4, player.width, player.height * 0.6);

  // Draw the player's head
  ctx.beginPath();
  ctx.arc(player.x + player.width / 2, player.y + player.height * 0.2, player.width / 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw the player's eyes
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(player.x + player.width * 0.35, player.y + player.height * 0.15, player.width / 10, 0, Math.PI * 2);
  ctx.arc(player.x + player.width * 0.65, player.y + player.height * 0.15, player.width / 10, 0, Math.PI * 2);
  ctx.fill();
}

// A game loop to update and render the game
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);
