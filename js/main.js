const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 720;

// Audio Assets
const popSound = new Audio('assets/audio/pop.mp3');
const shootSound = new Audio('assets/audio/shoot.mp3');
const winSound = new Audio('assets/audio/win.mp3');

function playSound(audioEl) {
    audioEl.currentTime = 0; 
    audioEl.play().catch(e => console.log("Audio play prevented until interaction"));
}

// UI Elements
const homeScreen = document.getElementById('home-screen');
const playBtn = document.getElementById('play-btn');
const coinDisplay = document.getElementById('coin-display');
const coinDisplayGame = document.getElementById('coin-display-game');
const topUI = document.getElementById('top-ui');
const bottomUI = document.getElementById('bottom-ui');
const movesDisplay = document.getElementById('moves-display');
const badgeBomb = document.getElementById('badge-bomb');
const badgeFireball = document.getElementById('badge-fireball');

const progressFill = document.getElementById('progress-fill');
const star1 = document.getElementById('star-1');
const star2 = document.getElementById('star-2');
const star3 = document.getElementById('star-3');

const storeScreen = document.getElementById('store-screen');
const closeStoreBtn = document.getElementById('close-store');
const storeCoinDisplay = document.getElementById('store-coin-display');

const resultScreen = document.getElementById('result-screen');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resultBtn = document.getElementById('result-btn');

// Game State
const MAX_LEVELS = 100;
let gameState = 'menu'; 
let totalCoins = 0;
let movesRemaining = 0;
let currentLevelIndex = 0;
let currentScore = 0;
let currentTargetScore = 0;

let inventory = {
    bomb: 2,
    fireball: 1
};

let isAiming = false;
let aimX = 0;
let aimY = 0;

// Loading Delay
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-indicator').style.display = 'none';
        document.getElementById('menu-content').style.display = 'flex';
        document.getElementById('menu-content').style.flexDirection = 'column';
        document.getElementById('menu-content').style.alignItems = 'center';
    }, 2500); 
});

// Storage
function saveGame() {
    const gameData = { coins: totalCoins, level: currentLevelIndex, inventory: inventory };
    localStorage.setItem('bubbleShooterSave', JSON.stringify(gameData));
}

function loadGame() {
    const savedData = localStorage.getItem('bubbleShooterSave');
    if (savedData) {
        const data = JSON.parse(savedData);
        totalCoins = data.coins || 0;
        currentLevelIndex = data.level || 0;
        if (data.inventory) inventory = data.inventory;
        updateCoins(0); 
        updateInventoryUI();
    }
    playBtn.innerText = `Play Level ${currentLevelIndex + 1}`;
}

function updateCoins(amount) {
    totalCoins += amount;
    coinDisplay.innerText = totalCoins;
    coinDisplayGame.innerText = totalCoins;
    saveGame();
}

function updateInventoryUI() {
    badgeBomb.innerText = inventory.bomb;
    badgeFireball.innerText = inventory.fireball;
}

function addScore(points) {
    currentScore += points;
    let percent = Math.min((currentScore / currentTargetScore) * 100, 100);
    progressFill.style.width = percent + '%';
    
    if (percent >= 30) { star1.classList.add('star-earned'); star1.innerText = '★'; }
    if (percent >= 60) { star2.classList.add('star-earned'); star2.innerText = '★'; }
    if (percent >= 90) { star3.classList.add('star-earned'); star3.innerText = '★'; }
}

function resetUIForNewLevel() {
    currentScore = 0;
    progressFill.style.width = '0%';
    star1.classList.remove('star-earned'); star1.innerText = '☆';
    star2.classList.remove('star-earned'); star2.innerText = '☆';
    star3.classList.remove('star-earned'); star3.innerText = '☆';
    
    initGrid(); 
    currentTargetScore = currentLevelData.targetScore;
    movesRemaining = currentLevelData.moves;
    movesDisplay.innerText = movesRemaining;
}

// Store Logic
function openStore() {
    storeCoinDisplay.innerText = totalCoins;
    storeScreen.style.display = 'flex';
}

closeStoreBtn.addEventListener('click', () => {
    storeScreen.style.display = 'none';
});

function buyItem(itemType, price, amount) {
    if (totalCoins >= price) {
        totalCoins -= price;
        inventory[itemType] += amount;
        updateCoins(0); 
        updateInventoryUI();
        storeCoinDisplay.innerText = totalCoins;
    } else {
        alert("Not enough coins! Keep playing to earn more.");
    }
}

// Flow Logic
playBtn.addEventListener('click', () => {
    [popSound, shootSound, winSound].forEach(sound => {
        sound.play().then(() => {
            sound.pause();
            sound.currentTime = 0;
        }).catch(err => console.log("Audio unlock pending"));
    });

    homeScreen.style.display = 'none'; 
    topUI.style.display = 'flex'; 
    bottomUI.style.display = 'flex';
    
    updateInventoryUI();
    resetUIForNewLevel();
    resetLauncher(); 
    gameState = 'playing';
});

resultBtn.addEventListener('click', () => {
    resultScreen.style.display = 'none';
    topUI.style.display = 'flex'; 
    bottomUI.style.display = 'flex';
    resetUIForNewLevel();
    resetLauncher(); 
    gameState = 'playing';
});

document.getElementById('result-menu-btn').addEventListener('click', () => {
    resultScreen.style.display = 'none';
    playBtn.innerText = `Play Level ${currentLevelIndex + 1}`;
    homeScreen.style.display = 'flex';
});

function triggerWin() {
    gameState = 'gameover';
    playSound(winSound);
    
    let reward = 4;
    let msg = `You earned ${reward} coins.`;
    
    if (Math.random() < 0.30) {
        reward += 12;
        msg = `You earned ${reward} coins (Includes +12 Bonus!)`;
    }

    updateCoins(reward);
    currentLevelIndex++;
    saveGame(); 
    
    resultTitle.innerText = "Level Cleared!";
    resultMessage.innerText = msg;
    
    if (currentLevelIndex < MAX_LEVELS) {
        resultBtn.innerText = "Next Level";
    } else {
        resultTitle.innerText = "🏆 YOU BEAT THE GAME! 🏆";
        resultMessage.innerText = "You cleared all 100 levels! " + msg;
        currentLevelIndex = 0; 
        saveGame();
        resultBtn.innerText = "Play Again";
    }
    
    topUI.style.display = 'none';
    bottomUI.style.display = 'none';
    resultScreen.style.display = 'flex'; 
}

// Power-up Inputs
document.getElementById('btn-fireball').addEventListener('click', () => {
    if (inventory.fireball > 0) {
        if (!currentBubble.isMoving && currentBubble.type !== 'fireball') {
            inventory.fireball--;
            updateInventoryUI();
            currentBubble.type = 'fireball';
            currentBubble.color = '#ff6600'; 
        }
    } else {
        openStore();
    }
});

document.getElementById('btn-bomb').addEventListener('click', () => {
    if (inventory.bomb > 0) {
        if (!currentBubble.isMoving && currentBubble.type !== 'bomb') {
            inventory.bomb--;
            updateInventoryUI();
            currentBubble.type = 'bomb';
            currentBubble.color = '#111'; 
        }
    } else {
        openStore();
    }
});

// Canvas Input
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

// Engine Loop
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

loadGame();
initGrid();
gameLoop();
