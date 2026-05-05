// js/particles.js - Standard 2D Particle Engine

// Array to hold all active particles
let particles = [];

// Particle Class definition
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        
        // Random velocity to make them fly outwards in all directions
        this.dx = (Math.random() - 0.5) * 8; // Multiplier defines speed
        this.dy = (Math.random() - 0.5) * 8;
        
        // Set properties for lifespan
        this.alpha = 1; // Full opacity
        this.decay = 0.02 + Math.random() * 0.03; // How fast it fades
        this.size = 3 + Math.random() * 2; // Varying small sizes
        this.gravity = 0.15; // Slow downward pull
    }

    update() {
        // Move the particle
        this.x += this.dx;
        this.y += this.dy;
        
        // Apply slight gravity to simulate falling dust
        this.dy += this.gravity;
        
        // Reduce opacity to fade out
        this.alpha -= this.decay;
    }

    draw(ctx) {
        if (this.alpha <= 0) return; // Don't draw invisible particles

        ctx.save();
        ctx.globalAlpha = this.alpha; // Set transparency for this draw
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.restore(); // Reset ctx state (removes transparency for others)
    }
}

// Function to generate an explosion of many particles
function createExplosion(x, y, color) {
    if (!color || color === null) return; // Prevent crashes on empty colors
    
    // Create 12 particles per bubble popped
    for (let i = 0; i < 12; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Global update/draw functions for the engine
function updateParticles() {
    // Standard loop to update and filter out dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1); // Remove from array if faded
        }
    }
}

function drawParticles(ctx) {
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);
    }
}
