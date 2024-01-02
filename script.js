let score = 0;
let enemies = [];

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = Math.random() * 450 + 'px'; // Random horizontal position
    enemy.style.top = '10px'; // Start at the top of the game area
    document.getElementById('gameArea').appendChild(enemy);
    enemies.push(enemy);
}

function enemyShoot(enemy) {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet', 'enemyBullet');
    let enemyLeft = parseInt(window.getComputedStyle(enemy).getPropertyValue("left"));
    let enemyTop = parseInt(window.getComputedStyle(enemy).getPropertyValue("top"));
    bullet.style.left = enemyLeft + 20 + 'px'; // Center the bullet on the enemy
    bullet.style.top = enemyTop + 20 + 'px'; // Adjust so it appears to come from the enemy
    document.getElementById('gameArea').appendChild(bullet);

    // Enemy bullet movement
    const interval = setInterval(function() {
        let bulletTop = parseInt(window.getComputedStyle(bullet).getPropertyValue("top"));
        if(bulletTop >= 500) {
            clearInterval(interval);
            bullet.remove();
        } else {
            bullet.style.top = bulletTop + 10 + 'px'; // Move bullet downwards

            // Check for collision with player
            const player = document.getElementById('player');
            let playerTop = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
            let playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue("left"));

            if(bulletTop >= playerTop && bulletTop <= (playerTop + 50) && bullet.style.left === player.style.left) {
                score -= 10; // Decrement score
                document.getElementById('score').textContent = `Score: ${score}`; // Update score display
                bullet.remove(); // Remove the bullet
                clearInterval(interval); // Stop the bullet's movement
            }
        }
    }, 100);
}

function initiateEnemyShooting() {
    enemies.forEach(enemy => {
        setTimeout(() => {
            enemyShoot(enemy);
        }, Math.random() * 3000 + 1000); // Enemies shoot at random times between 1 and 4 seconds
    });
}

for(let i = 0; i < 5; i++) { // Adjust number for more or fewer enemies
    createEnemy();
}
initiateEnemyShooting();

document.addEventListener('keydown', function(event) {
    const player = document.getElementById('player');
    const gameArea = document.getElementById('gameArea');
    const scoreDisplay = document.getElementById('score');
    let left = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
    let top = parseInt(window.getComputedStyle(player).getPropertyValue("top"));

    // Player movement
    if(event.key === "ArrowLeft" && left > 0) { left -= 10; }
    else if(event.key === "ArrowRight" && left < 450) { left += 10; }
    else if(event.key === "ArrowUp" && top > 0) { top -= 10; }
    else if(event.key === "ArrowDown" && top < 450) { top += 10; }

    player.style.left = left + 'px';
    player.style.top = top + 'px';

    // Bullet shooting
    if(event.code === "Space") {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.style.left = left + 20 + 'px'; // Center the bullet on the player
        bullet.style.top = top + 20 + 'px'; // Adjust so it appears to come from the player
        gameArea.appendChild(bullet);

        // Bullet movement
        const interval = setInterval(function() {
            let bulletTop = parseInt(window.getComputedStyle(bullet).getPropertyValue("top"));
            let bulletLeft = parseInt(window.getComputedStyle(bullet).getPropertyValue("left"));

            // Check for collisions with each enemy
            enemies.forEach((enemy, index) => {
                let enemyTop = parseInt(window.getComputedStyle(enemy).getPropertyValue("top"));
                let enemyLeft = parseInt(window.getComputedStyle(enemy).getPropertyValue("left"));

                // Collision detection
                if(bulletTop <= (enemyTop + 50) && bulletTop >= enemyTop && bulletLeft >= enemyLeft && bulletLeft <= (enemyLeft + 50)) {
                    score += 10; // Increment score
                    scoreDisplay.textContent = `Score: ${score}`; // Update score display
                    enemy.remove(); // Remove the enemy
                    enemies.splice(index, 1); // Remove from enemies array
                    createEnemy(); // Create a new enemy
                    bullet.remove(); // Remove the bullet
                    clearInterval(interval); // Stop the bullet's movement
                }
            });

            if(bulletTop <= -10) {
                clearInterval(interval);
                bullet.remove();
            } else {
                bullet.style.top = bulletTop - 10 + 'px'; // Move bullet upwards
            }
        }, 100);
    }
});
