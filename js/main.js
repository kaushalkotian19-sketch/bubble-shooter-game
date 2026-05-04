const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Standard game resolution (can be adjusted for mobile aspect ratios)
canvas.width = 480;
canvas.height = 720;

function update() {
    // Logic updates go here (physics, movement)
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw temporary text to confirm it's working
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Bubble Shooter Ready!", canvas.width / 2, canvas.height / 2);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
