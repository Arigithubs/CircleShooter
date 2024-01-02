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

for(let i = 0; i < 5; i++) { // Adjust number for more or fewer enemies
    createEnemy();
}

document.addEventListener('keydown', function(event) {
    const player = document.getElementById('player');
    const gameArea = document.getElementById('gameArea');
    const scoreDisplay = document.getElementById('score');
    let left = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
    let top = parseInt(window.getComputedStyle(player).getPropertyValue("top"));

    // Existing movement and shooting code...

    // Handle spacebar press for shooting bullets
    if(event.code === "Space") {
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        bullet.style.left = left + 20 + 'px';
        bullet.style.top = top + 20 + 'px';
        gameArea.appendChild(bullet);

        const interval = setInterval(function() {
            let bulletTop = parseInt(window.getComputedStyle(bullet).getPropertyValue("top"));
            let bulletLeft = parseInt(window.getComputedStyle(bullet).getPropertyValue("left"));

            enemies.forEach((enemy, index) => {
                let enemyTop = parseInt(window.getComputedStyle(enemy).getPropertyValue("top"));
                let enemyLeft = parseInt(window.getComputedStyle(enemy).getPropertyValue("left"));

                if(bulletTop <= (enemyTop + 50) && bulletTop >= enemyTop && bulletLeft >= enemyLeft && bulletLeft <= (enemyLeft + 50)) {
                    score += 10;
                    scoreDisplay.textContent = `Score: ${score}`;
                    enemy.remove();
                    enemies.splice(index, 1);
                    createEnemy();
                    bullet.remove();
                    clearInterval(interval);
                }
            });

            if(bulletTop <= -10) {
                clearInterval(interval);
                bullet.remove();
            } else {
                bullet.style.top = bulletTop - 10 + 'px';
            }
        }, 100);
    }
});
