// Input handling for both players

class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            justPressed: false
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            e.preventDefault();
        });
        
        // Mouse events
        const canvas = document.getElementById('gameCanvas');
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
            this.mouse.justPressed = true;
            e.preventDefault();
        });
        
        canvas.addEventListener('mouseup', (e) => {
            this.mouse.pressed = false;
            e.preventDefault();
        });
        
        // Prevent context menu
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }
    
    wasMouseJustPressed() {
        if (this.mouse.justPressed) {
            this.mouse.justPressed = false;
            return true;
        }
        return false;
    }
    
    getMousePosition() {
        return new Vector2(this.mouse.x, this.mouse.y);
    }
    
    // Player 1 controls (WASD + Mouse)
    getPlayer1Input() {
        const input = {
            moveX: 0,
            moveY: 0,
            aimAngle: 0,
            shoot: false
        };
        
        // Movement
        if (this.isKeyPressed('KeyW')) input.moveY -= 1;
        if (this.isKeyPressed('KeyS')) input.moveY += 1;
        if (this.isKeyPressed('KeyA')) input.moveX -= 1;
        if (this.isKeyPressed('KeyD')) input.moveX += 1;
        
        // Shooting - mouse click or hold
        input.shoot = this.mouse.pressed || this.wasMouseJustPressed();
        
        return input;
    }
    
    // Player 2 controls (Arrow keys + IJKL)
    getPlayer2Input() {
        const input = {
            moveX: 0,
            moveY: 0,
            aimX: 0,
            aimY: 0,
            shoot: false
        };
        
        // Movement
        if (this.isKeyPressed('ArrowUp')) input.moveY -= 1;
        if (this.isKeyPressed('ArrowDown')) input.moveY += 1;
        if (this.isKeyPressed('ArrowLeft')) input.moveX -= 1;
        if (this.isKeyPressed('ArrowRight')) input.moveX += 1;
        
        // Aiming/Shooting with IJKL
        if (this.isKeyPressed('KeyI')) input.aimY -= 1;
        if (this.isKeyPressed('KeyK')) input.aimY += 1;
        if (this.isKeyPressed('KeyJ')) input.aimX -= 1;
        if (this.isKeyPressed('KeyL')) input.aimX += 1;
        
        // Shoot if any aim key is pressed
        input.shoot = input.aimX !== 0 || input.aimY !== 0;
        
        return input;
    }
    
    update() {
        // Reset mouse just pressed state if not used this frame
        this.mouse.justPressed = false;
    }
}

class PlayerController {
    constructor(player, inputManager, playerNumber) {
        this.player = player;
        this.inputManager = inputManager;
        this.playerNumber = playerNumber;
    }
    
    update(deltaTime) {
        if (!this.player.alive) return;
        
        let input;
        
        if (this.playerNumber === 1) {
            input = this.inputManager.getPlayer1Input();
            this.handlePlayer1Input(input, deltaTime);
        } else {
            input = this.inputManager.getPlayer2Input();
            this.handlePlayer2Input(input, deltaTime);
        }
    }
    
    handlePlayer1Input(input, deltaTime) {
        // Movement
        const moveVector = new Vector2(input.moveX, input.moveY);
        if (moveVector.magnitude() > 0) {
            this.player.velocity = moveVector.normalize().multiply(this.player.speed);
        } else {
            this.player.velocity = new Vector2(0, 0);
        }
        
        // Aiming with mouse
        const mousePos = this.inputManager.getMousePosition();
        const aimVector = mousePos.subtract(this.player.position);
        if (aimVector.magnitude() > 0) {
            this.player.angle = vectorToAngle(aimVector);
        }
        
        // Shooting
        if (input.shoot) {
            const bullet = this.player.shoot();
            if (bullet) {
                return bullet; // Return bullet to be added to game
            }
        }
        
        return null;
    }
    
    handlePlayer2Input(input, deltaTime) {
        // Movement
        const moveVector = new Vector2(input.moveX, input.moveY);
        if (moveVector.magnitude() > 0) {
            this.player.velocity = moveVector.normalize().multiply(this.player.speed);
        } else {
            this.player.velocity = new Vector2(0, 0);
        }
        
        // Aiming with IJKL
        const aimVector = new Vector2(input.aimX, input.aimY);
        if (aimVector.magnitude() > 0) {
            this.player.angle = vectorToAngle(aimVector);
        }
        
        // Shooting
        if (input.shoot) {
            const bullet = this.player.shoot();
            if (bullet) {
                return bullet; // Return bullet to be added to game
            }
        }
        
        return null;
    }
}