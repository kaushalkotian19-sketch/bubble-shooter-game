// Constants for the launcher
const LAUNCHER_X = 240; // Center of our 480px canvas
const LAUNCHER_Y = 680; // Near the bottom
const BUBBLE_SPEED = 12;

// The bubble currently waiting to be shot
let currentBubble = {
    x: LAUNCHER_X,
    y: LAUNCHER_Y,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    dx: 0,
    dy: 0,
    isMoving: false
};

function aimAndShoot(targetX, targetY) {
    // Prevent shooting if a bubble is already in the air
    if (currentBubble.isMoving) return; 

    // Calculate the distance and angle
    let dx = targetX - currentBubble.x;
    let dy = targetY - currentBubble.y;
    let angle = Math.atan2(dy, dx);

    // Apply speed based on the angle
    currentBubble.dx = Math.cos(angle) * BUBBLE_SPEED;
    currentBubble.dy = Math.sin(angle) * BUBBLE_SPEED;
    currentBubble.isMoving = true;
}

function updatePhysics() {
    if (!currentBubble.isMoving) return;

    // Move the bubble
    currentBubble.x += currentBubble.dx;
    currentBubble.y += currentBubble.dy;

    // Wall Collisions (Left and Right bounds)
    if (currentBubble.x - BUBBLE_RADIUS <= 0 || currentBubble.x + BUBBLE_RADIUS >= canvas.width) {
        currentBubble.dx *= -1; // Reverse the X direction to bounce
    }

    // Ceiling Collision (Temporary check until we add grid snapping)
    if (currentBubble.y - BUBBLE_RADIUS <= 0) {
        currentBubble.isMoving = false;
        currentBubble.y = BUBBLE_RADIUS; 
        
        // Next up: We will replace this reset with our grid snapping logic!
        resetLauncher();
    }
}

function resetLauncher() {
    currentBubble.x = LAUNCHER_X;
    currentBubble.y = LAUNCHER_Y;
    currentBubble.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    currentBubble.dx = 0;
    currentBubble.dy = 0;
    currentBubble.isMoving = false;
}

function drawLauncher(ctx) {
    ctx.beginPath();
    ctx.arc(currentBubble.x, currentBubble.y, BUBBLE_RADIUS - 1, 0, Math.PI * 2);
    ctx.fillStyle = currentBubble.color;
    ctx.fill();
    
    // Add that 3D highlight effect
    ctx.beginPath();
    ctx.arc(currentBubble.x - 5, currentBubble.y - 5, 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fill();
    ctx.closePath();
}
