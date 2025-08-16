// Game entities: Player, Zombie, Bullet, etc.

class Entity {
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.radius = 10;
        this.alive = true;
    }
    
    update(deltaTime) {
        this.position = this.position.add(this.velocity.multiply(deltaTime));
    }
    
    draw(ctx) {
        drawCircle(ctx, this.position, this.radius, 'white');
    }
}

class Player extends Entity {
    constructor(x, y, playerNumber) {
        super(x, y);
        this.playerNumber = playerNumber;
        this.radius = 15;
        this.health = 100;
        this.maxHealth = 100;
        this.ammo = 30;
        this.maxAmmo = 30;
        this.score = 0;
        this.speed = 200;
        this.angle = 0;
        this.shootCooldown = 0;
        this.maxShootCooldown = 0.2; // 200ms between shots
        this.color = playerNumber === 1 ? '#00ff00' : '#0080ff';
    }
    
    update(deltaTime, bounds) {
        super.update(deltaTime);
        
        // Keep player in bounds
        this.position = keepInBounds(this.position, this.radius, bounds);
        
        // Update shoot cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
        
        // Clamp health
        this.health = clamp(this.health, 0, this.maxHealth);
        
        if (this.health <= 0) {
            this.alive = false;
        }
    }
    
    draw(ctx) {
        if (!this.alive) return;
        
        // Draw player body
        drawCircle(ctx, this.position, this.radius, this.color);
        
        // Draw direction indicator
        const direction = angleToVector(this.angle);
        const endPos = this.position.add(direction.multiply(this.radius + 10));
        drawLine(ctx, this.position, endPos, this.color, 3);
        
        // Draw health bar
        const healthBarWidth = 30;
        const healthBarHeight = 4;
        const healthBarPos = new Vector2(
            this.position.x - healthBarWidth / 2,
            this.position.y - this.radius - 10
        );
        
        // Background
        drawRect(ctx, healthBarPos, healthBarWidth, healthBarHeight, '#333');
        
        // Health
        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.6 ? '#00ff00' : 
                           healthPercent > 0.3 ? '#ffff00' : '#ff0000';
        drawRect(ctx, healthBarPos, healthBarWidth * healthPercent, healthBarHeight, healthColor);
    }
    
    canShoot() {
        return this.alive && this.ammo > 0 && this.shootCooldown <= 0;
    }
    
    shoot() {
        if (!this.canShoot()) return null;
        
        this.ammo--;
        this.shootCooldown = this.maxShootCooldown;
        
        const direction = angleToVector(this.angle);
        const bulletStart = this.position.add(direction.multiply(this.radius + 5));
        
        return new Bullet(bulletStart.x, bulletStart.y, this.angle, this);
    }
    
    takeDamage(damage) {
        this.health -= damage;
    }
    
    addScore(points) {
        this.score += points;
    }
}

class Zombie extends Entity {
    constructor(x, y) {
        super(x, y);
        this.radius = 12;
        this.health = 50;
        this.maxHealth = 50;
        this.speed = randomBetween(50, 100);
        this.damage = 20;
        this.attackCooldown = 0;
        this.maxAttackCooldown = 1.0; // 1 second between attacks
        this.target = null;
        this.color = '#ff0000';
    }
    
    update(deltaTime, players, bounds) {
        if (!this.alive) return;
        
        // Find closest living player
        this.target = this.findClosestPlayer(players);
        
        if (this.target) {
            // Move towards target
            const direction = this.target.position.subtract(this.position).normalize();
            this.velocity = direction.multiply(this.speed);
        } else {
            this.velocity = new Vector2(0, 0);
        }
        
        super.update(deltaTime);
        
        // Keep in bounds
        this.position = keepInBounds(this.position, this.radius, bounds);
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        // Check if can attack target
        if (this.target && this.attackCooldown <= 0) {
            const distance = this.position.distance(this.target.position);
            if (distance < this.radius + this.target.radius + 5) {
                this.attack(this.target);
            }
        }
        
        if (this.health <= 0) {
            this.alive = false;
        }
    }
    
    findClosestPlayer(players) {
        let closest = null;
        let closestDistance = Infinity;
        
        for (const player of players) {
            if (!player.alive) continue;
            
            const distance = this.position.distance(player.position);
            if (distance < closestDistance) {
                closestDistance = distance;
                closest = player;
            }
        }
        
        return closest;
    }
    
    attack(target) {
        this.attackCooldown = this.maxAttackCooldown;
        target.takeDamage(this.damage);
    }
    
    draw(ctx) {
        if (!this.alive) return;
        
        // Draw zombie body
        drawCircle(ctx, this.position, this.radius, this.color);
        
        // Draw health bar for zombies too
        const healthBarWidth = 20;
        const healthBarHeight = 3;
        const healthBarPos = new Vector2(
            this.position.x - healthBarWidth / 2,
            this.position.y - this.radius - 8
        );
        
        const healthPercent = this.health / this.maxHealth;
        drawRect(ctx, healthBarPos, healthBarWidth * healthPercent, healthBarHeight, '#ff4444');
    }
    
    takeDamage(damage) {
        this.health -= damage;
    }
}

class Bullet extends Entity {
    constructor(x, y, angle, owner) {
        super(x, y);
        this.radius = 3;
        this.speed = 500;
        this.damage = 25;
        this.owner = owner;
        this.color = '#ffff00';
        this.lifetime = 2.0; // 2 seconds
        
        const direction = angleToVector(angle);
        this.velocity = direction.multiply(this.speed);
    }
    
    update(deltaTime, bounds) {
        super.update(deltaTime);
        
        this.lifetime -= deltaTime;
        
        // Remove if out of bounds or lifetime expired
        if (this.position.x < 0 || this.position.x > bounds.width ||
            this.position.y < 0 || this.position.y > bounds.height ||
            this.lifetime <= 0) {
            this.alive = false;
        }
    }
    
    draw(ctx) {
        if (!this.alive) return;
        drawCircle(ctx, this.position, this.radius, this.color);
    }
}