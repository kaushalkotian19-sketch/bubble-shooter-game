const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 720;

const homeScreen = document.getElementById('home-screen');
const playBtn = document.getElementById('play-btn');
const coinDisplay = document.getElementById('coin-display');
const coinDisplayGame = document.getElementById('coin-display-game');
const topUI = document.getElementById('top-ui');
const bottomUI = document.getElementById('bottom-ui');
const movesDisplay = document.getElementById('moves-display');
const badgeBomb = document.getElementById('badge-bomb');
const badgeFireball = document.getElementById('badge-fireball');

let gameState = 'menu'; 
let totalCoins = 0;
let movesRemaining = 0;

let inventory = {
    bomb: 2,
    fireball: 1
};

let isAiming = false;
let aimX = 0;
let aimY = 0;

function updateCoins(amount) {
    totalCoins += amount;
    coinDisplay.innerText = totalCoins;
    coinDisplayGame.innerText = totalCoins;
}

function updateInventoryUI() {
    badgeBomb.innerText = inventory.bomb;
    badgeFireball.innerText = inventory.fireball;
}

playBtn.addEventListener('click', () => {
    homeScreen.style.display = 'none'; 
    topUI.style.display = 'flex'; 
    bottomUI.style.display = 'flex';
    
    movesRemaining = LEVELS[currentLevelIndex].moves;
    movesDisplay.innerText = movesRemaining;
    updateInventoryUI();
    
    initGrid(); 
    resetLauncher(); 
    gameState = 'playing';
});

document.getElementById('btn-fireball').addEventListener('click', () => {
    if (inventory.fireball > 0 && !currentBubble.isMoving && currentBubble.type !== 'fireball') {
        inventory.fireball--;
        updateInventoryUI();
        currentBubble.type = 'fireball';
        currentBubble.color = '#ff6600'; 
    }
});

document.getElementById('btn-bomb').addEventListener('click', () => {
    if (inventory.bomb > 0 && !currentBubble.isMoving && currentBubble.type !== 'bomb') {
        inventory.bomb--;
        updateInventoryUI();
        currentBubble.type = 'bomb';
        currentBubble.color = '#111'; 
    }
});

function triggerWin() {
    gameState = 'gameover';
    
    let reward = 4;
    if (Math.random() < 0.30) {
        reward += 12;
        alert(`Level Cleared! You won ${reward} coins (Includes +12 Bonus!)`);
    } else {
        alert(`Level Cleared! You won ${reward} coins.`);
    }

    updateCoins(reward);
    homeScreen.style.display = 'flex'; 
    topUI.style.display = 'none';
    bottomUI.style.display = 'none';
}

function handleInputStart(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    let clickX = clientX - rect.left;
    let clickY = clientY - rect.top;

    let dx = clickX - LAUNCHER_X;
    let dy = clickY - LAUNCHER_Y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= BUBBLE_RADIUS * 2.5) {
        swapBubbles();
        isAiming = false; 
    } else {
        isAiming = true;
        aimX = clickX;
        aimY = clickY;
    }
}

function updateAimTarget(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    aimX = clientX - rect.left;
    aimY = clientY - rect.top;
}

canvas.addEventListener('mousedown', (e) => {
    handleInputStart(e.clientX, e.clientY);
});

canvas.addEventListener('mousemove', (e) => {
    if (isAiming) updateAimTarget(e.clientX, e.clientY);
});

canvas.addEventListener('mouseup', () => {
    if (isAiming) {
        aimAndShoot(aimX, aimY);
        isAiming = false;
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    handleInputStart(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isAiming) updateAimTarget(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

canvas.addEventListener('touchend', () => {
    if (isAiming) {
        aimAndShoot(aimX, aimY);
        isAiming = false;
    }
});

function update() {
    updatePhysics(); 
    updateParticles();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'playing') {
        drawGrid(ctx);
        if (isAiming) {
            drawTrajectory(ctx, aimX, aimY);
        }
        drawLauncher(ctx); 
        drawParticles(ctx);
    }
}

function gameLoop() {
    if (gameState === 'playing') {
        update();
    }
    draw(); 
    requestAnimationFrame(gameLoop);
}

initGrid();
gameLoop();
