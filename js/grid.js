const BUBBLE_RADIUS = 20;
const ROWS = 10;
const COLS = 11; 
const COLORS = ['#ff4d4d', '#4dff4d', '#4d4dff', '#ffff4d', '#ff4dff'];

const LEVELS = [
    {
        moves: 20,
        layout: [
            [1, 1, 2, 2, 3, 3, 4, 4, 1, 1, 2], 
            [0, 1, 2, 3, 4, 1, 2, 3, 4, 1],    
            [0, 0, 1, 1, 9, 9, 2, 2, 0, 0, 0], 
            [0, 0, 0, 1, 1, 2, 2, 0, 0, 0],    
            [0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0]  
        ]
    }
];

let currentLevelIndex = 0;
let gameGrid = [];

function initGrid() {
    let levelData = LEVELS[currentLevelIndex];
    
    for (let r = 0; r < ROWS; r++) {
        gameGrid[r] = [];
        for (let c = 0; c < COLS; c++) {
            if (levelData.layout[r] && levelData.layout[r][c]) {
                let cellValue = levelData.layout[r][c];
                
                if (cellValue >= 1 && cellValue <= 5) {
                    gameGrid[r][c] = COLORS[cellValue - 1]; 
                } else if (cellValue === 9) {
                    gameGrid[r][c] = '#111'; 
                }
            } else {
                gameGrid[r][c] = null; 
            }
        }
    }
}

function getBubbleCoords(row, col) {
    let x = col * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS;
    if (row % 2 !== 0) x += BUBBLE_RADIUS;
    let y = row * (BUBBLE_RADIUS * 1.7) + BUBBLE_RADIUS;
    return { x, y };
}

function drawGrid(ctx) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            let color = gameGrid[r][c];
            if (color) {
                let { x, y } = getBubbleCoords(r, c);
                
                ctx.beginPath();
                ctx.arc(x, y, BUBBLE_RADIUS - 1, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                
                ctx.beginPath();
                ctx.arc(x - 5, y - 5, 5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function getNeighbors(r, c) {
    let neighbors = [];
    neighbors.push({ r: r, c: c - 1 });
    neighbors.push({ r: r, c: c + 1 });
    
    if (r % 2 === 0) {
        neighbors.push({ r: r - 1, c: c - 1 });
        neighbors.push({ r: r - 1, c: c });
        neighbors.push({ r: r + 1, c: c - 1 });
        neighbors.push({ r: r + 1, c: c });
    } else {
        neighbors.push({ r: r - 1, c: c });
        neighbors.push({ r: r - 1, c: c + 1 });
        neighbors.push({ r: r + 1, c: c });
        neighbors.push({ r: r + 1, c: c + 1 });
    }
    return neighbors.filter(n => n.r >= 0 && n.r < ROWS && n.c >= 0 && n.c < COLS);
}

function findMatches(startRow, startCol, targetColor) {
    let queue = [{ r: startRow, c: startCol }];
    let matched = [];
    let visited = new Set();
    visited.add(`${startRow},${startCol}`);
    
    while(queue.length > 0) {
        let current = queue.shift();
        matched.push(current);
        let neighbors = getNeighbors(current.r, current.c);
        
        for (let n of neighbors) {
            let key = `${n.r},${n.c}`;
            if (!visited.has(key) && gameGrid[n.r][n.c] === targetColor) {
                visited.add(key);
                queue.push(n); 
            }
        }
    }
    return matched;
}

function removeOrphans() {
    let safeBubbles = new Set();
    let queue = [];
    
    for (let c = 0; c < COLS; c++) {
        if (gameGrid[0][c]) { 
            queue.push({ r: 0, c: c });
            safeBubbles.add(`0,${c}`);
        }
    }
    
    while (queue.length > 0) {
        let current = queue.shift();
        let neighbors = getNeighbors(current.r, current.c);
        for (let n of neighbors) {
            let key = `${n.r},${n.c}`;
            if (gameGrid[n.r][n.c] && !safeBubbles.has(key)) {
                safeBubbles.add(key);
                queue.push(n);
            }
        }
    }
    
    let orphansFound = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (gameGrid[r][c] && !safeBubbles.has(`${r},${c}`)) {
                let { x, y } = getBubbleCoords(r, c);
                createExplosion(x, y, gameGrid[r][c]); // Explode orphans too!
                gameGrid[r][c] = null; 
                orphansFound++;
            }
        }
    }
    return orphansFound;
}

function checkGameOver() {
    let bottomRow = ROWS - 2; 
    for (let c = 0; c < COLS; c++) {
        if (gameGrid[bottomRow][c] !== null) {
            alert("Game Over! The bubbles reached the bottom.");
            gameState = 'gameover';
            document.getElementById('home-screen').style.display = 'flex';
            document.getElementById('top-ui').style.display = 'none';
            document.getElementById('bottom-ui').style.display = 'none';
            return true;
        }
    }
    
    let isBoardClear = true;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (gameGrid[r][c] !== null) {
                isBoardClear = false;
                break;
            }
        }
    }
    
    if (isBoardClear) {
        triggerWin();
        return true;
    }

    if (!isBoardClear && !currentBubble.isMoving && movesRemaining <= 0) {
        setTimeout(() => { 
            alert("Out of moves! Game Over.");
            gameState = 'gameover';
            document.getElementById('home-screen').style.display = 'flex';
            document.getElementById('top-ui').style.display = 'none';
            document.getElementById('bottom-ui').style.display = 'none';
        }, 500);
        return true;
    }
    
    return false;
}

function snapBubble(x, y, color) {
    let row = Math.round((y - BUBBLE_RADIUS) / (BUBBLE_RADIUS * 1.7));
    row = Math.max(0, Math.min(row, ROWS - 1)); 

    let offset = (row % 2 !== 0) ? BUBBLE_RADIUS : 0;
    let col = Math.round((x - BUBBLE_RADIUS - offset) / (BUBBLE_RADIUS * 2));
    col = Math.max(0, Math.min(col, COLS - 1)); 

    if (row < ROWS && col < COLS) {
        
        if (currentBubble.type === 'bomb') {
            let blastRadius = getNeighbors(row, col);
            blastRadius.push({ r: row, c: col }); 
            
            blastRadius.forEach(n => {
                if (gameGrid[n.r][n.c]) {
                    let { x: bx, y: by } = getBubbleCoords(n.r, n.c);
                    createExplosion(bx, by, gameGrid[n.r][n.c]);
                    gameGrid[n.r][n.c] = null;
                }
            });
            
            removeOrphans();
            checkGameOver();
            return; 
        }

        gameGrid[row][col] = color;
        let matches = findMatches(row, col, color);
        
        if (matches.length >= 3) {
            matches.forEach(m => {
                let { x: mx, y: my } = getBubbleCoords(m.r, m.c);
                createExplosion(mx, my, color);
                gameGrid[m.r][m.c] = null; 
            });
            removeOrphans(); 
        }
        
        checkGameOver();
    }
}
