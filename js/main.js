const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 480;
canvas.height = 720;

// UI Elements
const homeScreen = document.getElementById('home-screen');
const playBtn = document.getElementById('play-btn');
const coinDisplay = document.getElementById('coin-display');

// Game State & Economy
let gameState = 'menu'; 
let totalCoins = 0;

// Audio setup (Requires actual files in your assets folder to work)
const popSound = new Audio('assets/audio/pop.mp3');
const shootSound = new Audio('assets/audio/shoot.mp3');
const winSound = new Audio('assets/audio/win.mp3');

function playSound(audioEl) {
    audioEl.currentTime = 0; 
    audioEl.play().catch(e => console.log("Audio play prevented until interaction"));
}

function updateCoins(amount) {
    totalCoins += amount;
    coinDisplay.innerText = totalCoins;
}

playBtn.addEventListener('click', () => {
    homeScreen.style.display = 'none'; 
    initGrid(); 
    resetLauncher(); 
    gameState = 'playing';
});

function triggerWin() {
    gameState = 'gameover';
    playSound(winSound);
    
    let reward = 4;
    
    if (Math.random() < 0.30) {
        reward += 12;
        alert(`Level Cleared! You won ${reward} coins (Includes +12 Bonus!)`);
    } else {
        alert(`Level Cleared! You won ${reward} coins.`);
    }

    updateCoins(reward);
    homeScreen.style.display = 'flex'; 
}

// Input Handling
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    aimAndShoot(mouseX, mouseY);
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    aimAndShoot(touchX, touchY);
}, { passive: false });


// Core Engine Loop
function update() {
    updatePhysics(); 
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'playing') {
        drawGrid(ctx);
        drawLauncher(ctx); 
    }
}

function gameLoop() {
    if (gameState === 'playing') {
        update();
    }
    draw(); 
    requestAnimationFrame(gameLoop);
}

// Initialize and wait for player
initGrid();
gameLoop();
