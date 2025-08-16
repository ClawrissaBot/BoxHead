// Main game engine

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.bounds = {
            width: this.canvas.width,
            height: this.canvas.height
        };
        
        // Game state
        this.gameState = 'playing'; // 'playing', 'paused', 'gameOver'
        this.wave = 1;
        this.zombiesPerWave = 5;
        this.zombiesSpawned = 0;
        this.zombiesKilled = 0;
        
        // Entities
        this.players = [];
        this.zombies = [];
        this.bullets = [];
        
        // Input
        this.inputManager = new InputManager();
        this.playerControllers = [];
        
        // Timing
        this.lastTime = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 2.0; // 2 seconds between spawns
        
        this.initialize();
    }
    
    initialize() {
        // Create players
        const player1 = new Player(200, 200, 1);
        const player2 = new Player(this.bounds.width - 200, 200, 2);
        
        this.players.push(player1);
        this.players.push(player2);
        
        // Create controllers
        this.playerControllers.push(new PlayerController(player1, this.inputManager, 1));
        this.playerControllers.push(new PlayerController(player2, this.inputManager, 2));
        
        // Start first wave
        this.startWave();
    }
    
    startWave() {
        this.zombiesSpawned = 0;
        this.zombiesKilled = 0;
        this.spawnTimer = 0;
        
        // Clear existing zombies
        this.zombies = [];
        
        // Calculate zombies for this wave
        this.zombiesPerWave = 5 + (this.wave - 1) * 3;
    }
    
    spawnZombie() {
        if (this.zombiesSpawned >= this.zombiesPerWave) return;
        
        // Spawn zombies at random edges of the screen
        let x, y;
        const side = randomInt(0, 3);
        
        switch (side) {
            case 0: // Top
                x = randomBetween(0, this.bounds.width);
                y = -20;
                break;
            case 1: // Right
                x = this.bounds.width + 20;
                y = randomBetween(0, this.bounds.height);
                break;
            case 2: // Bottom
                x = randomBetween(0, this.bounds.width);
                y = this.bounds.height + 20;
                break;
            case 3: // Left
                x = -20;
                y = randomBetween(0, this.bounds.height);
                break;
        }
        
        const zombie = new Zombie(x, y);
        this.zombies.push(zombie);
        this.zombiesSpawned++;
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // Update input
        this.inputManager.update();
        
        // Update players and handle shooting
        for (const controller of this.playerControllers) {
            const bullet = controller.update(deltaTime);
            if (bullet) {
                this.bullets.push(bullet);
            }
        }
        
        // Update players
        for (const player of this.players) {
            player.update(deltaTime, this.bounds);
        }
        
        // Update zombies
        for (const zombie of this.zombies) {
            zombie.update(deltaTime, this.players, this.bounds);
        }
        
        // Update bullets
        for (const bullet of this.bullets) {
            bullet.update(deltaTime, this.bounds);
        }
        
        // Handle collisions
        this.handleCollisions();
        
        // Remove dead entities
        this.cleanupEntities();
        
        // Spawn zombies
        this.spawnTimer += deltaTime;
        if (this.spawnTimer >= this.spawnInterval && this.zombiesSpawned < this.zombiesPerWave) {
            this.spawnZombie();
            this.spawnTimer = 0;
        }
        
        // Check wave completion
        if (this.zombiesSpawned >= this.zombiesPerWave && this.zombies.length === 0) {
            this.wave++;
            this.startWave();
        }
        
        // Check game over
        const alivePlayers = this.players.filter(p => p.alive);
        if (alivePlayers.length === 0) {
            this.gameState = 'gameOver';
        }
        
        // Update UI
        this.updateUI();
    }
    
    handleCollisions() {
        // Bullet vs Zombie collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (!bullet.alive) continue;
            
            for (let j = this.zombies.length - 1; j >= 0; j--) {
                const zombie = this.zombies[j];
                if (!zombie.alive) continue;
                
                if (circleCollision(bullet.position, bullet.radius, zombie.position, zombie.radius)) {
                    zombie.takeDamage(bullet.damage);
                    bullet.alive = false;
                    
                    if (!zombie.alive) {
                        bullet.owner.addScore(100);
                        this.zombiesKilled++;
                    }
                    break;
                }
            }
        }
    }
    
    cleanupEntities() {
        this.bullets = this.bullets.filter(bullet => bullet.alive);
        this.zombies = this.zombies.filter(zombie => zombie.alive);
    }
    
    render() {
        // Clear screen
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);
        
        // Draw grid pattern
        this.drawGrid();
        
        // Draw entities
        for (const bullet of this.bullets) {
            bullet.draw(this.ctx);
        }
        
        for (const zombie of this.zombies) {
            zombie.draw(this.ctx);
        }
        
        for (const player of this.players) {
            player.draw(this.ctx);
        }
        
        // Draw wave info
        this.drawWaveInfo();
        
        // Draw game over screen
        if (this.gameState === 'gameOver') {
            this.drawGameOver();
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        
        // Vertical lines
        for (let x = 0; x <= this.bounds.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.bounds.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.bounds.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.bounds.width, y);
            this.ctx.stroke();
        }
    }
    
    drawWaveInfo() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Wave ${this.wave}`, this.bounds.width / 2, 30);
        
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`Zombies: ${this.zombies.length} | Killed: ${this.zombiesKilled}/${this.zombiesPerWave}`, 
                          this.bounds.width / 2, 50);
    }
    
    drawGameOver() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);
        
        // Game over text
        this.ctx.fillStyle = 'red';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.bounds.width / 2, this.bounds.height / 2 - 50);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Wave reached: ${this.wave}`, this.bounds.width / 2, this.bounds.height / 2);
        
        const totalScore = this.players.reduce((sum, player) => sum + player.score, 0);
        this.ctx.fillText(`Total Score: ${totalScore}`, this.bounds.width / 2, this.bounds.height / 2 + 30);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Refresh to play again', this.bounds.width / 2, this.bounds.height / 2 + 70);
    }
    
    updateUI() {
        // Update player stats in UI
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            const playerNum = i + 1;
            
            document.getElementById(`p${playerNum}-health`).textContent = Math.max(0, player.health);
            document.getElementById(`p${playerNum}-ammo`).textContent = player.ammo;
            document.getElementById(`p${playerNum}-score`).textContent = player.score;
        }
    }
    
    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Cap delta time to prevent large jumps
        const cappedDeltaTime = Math.min(deltaTime, 0.016); // ~60 FPS max
        
        this.update(cappedDeltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    start() {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }
}