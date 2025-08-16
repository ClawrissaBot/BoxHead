// Utility functions for the game

// Vector math utilities
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    
    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    
    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2(0, 0);
        return new Vector2(this.x / mag, this.y / mag);
    }
    
    distance(other) {
        return this.subtract(other).magnitude();
    }
    
    clone() {
        return new Vector2(this.x, this.y);
    }
}

// Collision detection utilities
function circleCollision(pos1, radius1, pos2, radius2) {
    const distance = pos1.distance(pos2);
    return distance < (radius1 + radius2);
}

function pointInRect(point, rect) {
    return point.x >= rect.x && 
           point.x <= rect.x + rect.width &&
           point.y >= rect.y && 
           point.y <= rect.y + rect.height;
}

// Math utilities
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(randomBetween(min, max + 1));
}

// Angle utilities
function angleToVector(angle) {
    return new Vector2(Math.cos(angle), Math.sin(angle));
}

function vectorToAngle(vector) {
    return Math.atan2(vector.y, vector.x);
}

function angleBetweenPoints(from, to) {
    const diff = to.subtract(from);
    return Math.atan2(diff.y, diff.x);
}

// Canvas drawing utilities
function drawCircle(ctx, pos, radius, color = 'white') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawRect(ctx, pos, width, height, color = 'white') {
    ctx.fillStyle = color;
    ctx.fillRect(pos.x, pos.y, width, height);
}

function drawLine(ctx, from, to, color = 'white', width = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

// Game boundaries
function keepInBounds(pos, radius, bounds) {
    return new Vector2(
        clamp(pos.x, radius, bounds.width - radius),
        clamp(pos.y, radius, bounds.height - radius)
    );
}