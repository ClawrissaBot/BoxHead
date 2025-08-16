// Main entry point - initializes and starts the game

let game;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game
    game = new Game();
    
    // Start the game loop
    game.start();
    
    console.log('BoxHead Zombie Survival Game Started!');
    console.log('Controls:');
    console.log('Player 1: WASD to move, Mouse to aim/shoot');
    console.log('Player 2: Arrow keys to move, IJKL to shoot');
});

// Handle page visibility changes to pause/resume
document.addEventListener('visibilitychange', () => {
    if (game) {
        if (document.hidden) {
            game.gameState = 'paused';
        } else {
            game.gameState = 'playing';
        }
    }
});

// Prevent default behavior for game keys
document.addEventListener('keydown', (e) => {
    const gameKeys = [
        'KeyW', 'KeyA', 'KeyS', 'KeyD',
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'KeyI', 'KeyJ', 'KeyK', 'KeyL'
    ];
    
    if (gameKeys.includes(e.code)) {
        e.preventDefault();
    }
});