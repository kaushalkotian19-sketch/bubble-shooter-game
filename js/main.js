// main.js - Central game loop and input handling

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Standard game resolution 
canvas.width = 480;
canvas.height = 720;

// Initialize the grid once when the game loads
initGrid();

// --- INPUT HANDLING ---

// Listen for mouse clicks to shoot
canvas.addEventListener('mousedown', (e) => {
    // Get accurate mouse coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    aimAndShoot(mouseX, mouseY);
});

// Support touch screens for mobile deployment
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent accidental scrolling while tapping
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    aimAndShoot(touchX, touchY);
}, { passive: false });


// --- GAME ENGINE ---

function update() {
    // Move the bubble and check for wall boundaries (logic from physics.js)
    updatePhysics(); 
}

function draw() {
    // Clear the canvas for the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the static grid of bubbles (logic from grid.js)
    drawGrid(ctx);
    
    // Draw our moving (or waiting) launcher bubble (logic from physics.js)
    drawLauncher(ctx); 
}

function gameLoop() {
    update();
    draw();
    
    // Request the next frame to create a smooth animation loop
    requestAnimationFrame(gameLoop);
}

// Start the engine!
gameLoop();
