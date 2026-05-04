const LAUNCHER_X = 240; 
const LAUNCHER_Y = 680; 
const BUBBLE_SPEED = 12;

let currentBubble = {
    x: LAUNCHER_X,
    y: LAUNCHER_Y,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    dx: 0,
    dy: 0,
    isMoving: false,
    type: 'normal'
};

function aimAndShoot(targetX, targetY) {
    if (currentBubble.isMoving || gameState !== 'playing') return; 

    // Play shoot sound if you have audio added later
    // playSound(shootSound); 

    let dx = targetX - currentBubble.x;
    let dy = targetY - currentBubble.y;
    let angle = Math.atan2(dy, dx);

    currentBubble.dx = Math.cos(angle) * BUBBLE_SPEED;
    currentBubble.dy = Math.sin(angle) * BUBBLE_SPEED;
    currentBubble.isMoving = true;
}

function updatePhysics() {
    if (!currentBubble.isMoving) return;

    currentBubble.x += currentBubble.dx;
    currentBubble.y += currentBubble.dy;

    if (currentBubble.x - BUBBLE_RADIUS <= 0 || currentBubble.x + BUBBLE_RADIUS >= 480) { // 480 is canvas width
        currentBubble.dx *= -1; 
    }

    let collided = false;

    if (currentBubble.y - BUBBLE_RADIUS <= 0) {
        collided = true;
    }

    if (!collided) {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (gameGrid[r][c]) { 
                    let bubblePos = getBubbleCoords(r, c);
                    let dx = currentBubble.x - bubblePos.x;
                    let dy = currentBubble.y - bubblePos.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance <= (BUBBLE_RADIUS * 2) - 2) { 
                        collided = true;
                        break;
                    }
                }
            }
            if (collided) break;
        }
    }

    if (collided) {
        currentBubble.isMoving = false;
        snapBubble(currentBubble.x, currentBubble.y, currentBubble.color);
        resetLauncher();
    }
}

function resetLauncher() {
    currentBubble.x = LAUNCHER_X;
    currentBubble.y = LAUNCHER_Y;
    currentBubble.dx = 0;
    currentBubble.dy = 0;
    currentBubble.isMoving = false;

    if (Math.random() < 0.07) {
        currentBubble.type = 'bomb';
        currentBubble.color = '#111'; 
    } else {
        currentBubble.type = 'normal';
        currentBubble.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
}

function drawLauncher(ctx) {
    ctx.beginPath();
    ctx.arc(currentBubble.x, currentBubble.y, BUBBLE_RADIUS - 1, 0, Math.PI * 2);
    ctx.fillStyle = currentBubble.color;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(currentBubble.x - 5, currentBubble.y - 5, 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fill();
    ctx.closePath();
}
