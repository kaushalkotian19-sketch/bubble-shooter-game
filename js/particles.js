let particles = [];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8; 
        this.dy = (Math.random() - 0.5) * 8;
        this.alpha = 1; 
        this.decay = 0.02 + Math.random() * 0.03; 
        this.size = 3 + Math.random() * 2; 
        this.gravity = 0.15; 
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.dy += this.gravity;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        if (this.alpha <= 0) return; 
        ctx.save();
        ctx.globalAlpha = this.alpha; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore(); 
    }
}

function createExplosion(x, y, color) {
    if (!color || color === null) return; 
    for (let i = 0; i < 12; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1); 
        }
    }
}

function drawParticles(ctx) {
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);
    }
}
