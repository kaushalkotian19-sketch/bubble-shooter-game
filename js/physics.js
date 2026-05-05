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

let nextBubble = {
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    type: 'normal'
};

function aimAndShoot(targetX, targetY) {
    if (currentBubble.isMoving || gameState !== 'playing' || movesRemaining <= 0) return; 

    movesRemaining--;
    document.getElementById('moves-display').innerText = movesRemaining;

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

    if (currentBubble.x - BUBBLE_RADIUS <= 0 || currentBubble.x + BUBBLE_RADIUS >= 480) { 
        currentBubble.dx *= -1; 
    }

    if (currentBubble.type === 'fireball') {
        if (currentBubble.y - BUBBLE_RADIUS <= 0) {
            currentBubble.isMoving = false;
            removeOrphans(); 
            checkGameOver();
            resetLauncher();
            return;
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (gameGrid[r][c]) {
                    let bubblePos = getBubbleCoords(r, c);
                    let dx = currentBubble.x - bubblePos.x;
                    let dy = currentBubble.y - bubblePos.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance <= BUBBLE_RADIUS * 2) {
                        createExplosion(bubblePos.x, bubblePos.y, gameGrid[r][c]);
                        gameGrid[r][c] = null; 
                    }
                }
            }
        }
        return; 
    }

    let collided = false;
    if (currentBubble.y - BUBBLE_RADIUS <= 0) collided = true;

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

    currentBubble.type = nextBubble.type;
    currentBubble.color = nextBubble.color;

    if (Math.random() < 0.07) {
        nextBubble.type = 'bomb';
        nextBubble.color = '#111'; 
    } else {
        nextBubble.type = 'normal';
        nextBubble.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
}

function swapBubbles() {
    if (currentBubble.isMoving) return;

    let tempColor = currentBubble.color;
    let tempType = currentBubble.type;

    currentBubble.color = nextBubble.color;
    currentBubble.type = nextBubble.type;

    nextBubble.color = tempColor;
    nextBubble.type = tempType;
}

function drawTrajectory(ctx, targetX, targetY) {
    if (currentBubble.isMoving || gameState !== 'playing') return;

    let dx = targetX - currentBubble.x;
    let dy = targetY - currentBubble.y;
    if (dy > 0) return; 

    let angle = Math.atan2(dy, dx);
    let simX = currentBubble.x;
    let simY = currentBubble.y;
    let simDx = Math.cos(angle) * (BUBBLE_SPEED * 1.5);
    let simDy = Math.sin(angle) * (BUBBLE_SPEED * 1.5);

    ctx.fillStyle = currentBubble.color;
    ctx.globalAlpha = 0.6; 

    for (let i = 0; i < 35; i++) { 
        simX += simDx; 
        simY += simDy;

        if (simX - BUBBLE_RADIUS <= 0 || simX + BUBBLE_RADIUS >= 480) { 
            simDx *= -1; 
        }

        if (simY - BUBBLE_RADIUS <= 0) break;

        ctx.beginPath();
        ctx.arc(simX, simY, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1.0; 
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

    let nextX = currentBubble.x + BUBBLE_RADIUS * 2.5;
    let nextY = currentBubble.y + 5; 
    
    ctx.beginPath();
    ctx.arc(nextX, nextY, BUBBLE_RADIUS * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = nextBubble.color;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(nextX - 3, nextY - 3, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fill();
    ctx.closePath();
    
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⇄", currentBubble.x + BUBBLE_RADIUS * 1.3, currentBubble.y + 5);
}
