// Constants for the grid
const BUBBLE_RADIUS = 20;
const ROWS = 10;
const COLS = 11; // 11 bubbles on even rows, 10 on odd rows
const COLORS = ['#ff4d4d', '#4dff4d', '#4d4dff', '#ffff4d', '#ff4dff'];

let gameGrid = [];

function initGrid() {
    for (let r = 0; r < ROWS; r++) {
        gameGrid[r] = [];
        for (let c = 0; c < COLS; c++) {
            // Only fill the top half of the grid to start
            if (r < 5) {
                // Randomly assign a color from our array
                gameGrid[r][c] = COLORS[Math.floor(Math.random() * COLORS.length)];
            } else {
                gameGrid[r][c] = null; // Empty space
            }
        }
    }
}

function getBubbleCoords(row, col) {
    let x = col * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS;
    
    // Shift every odd row to the right by one radius
    if (row % 2 !== 0) {
        x += BUBBLE_RADIUS;
    }
    
    // Y is slightly compressed (1.7 instead of 2) so they nestle together
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
                
                // Optional: Add a small highlight for a 3D effect
                ctx.beginPath();
                ctx.arc(x - 5, y - 5, 5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
