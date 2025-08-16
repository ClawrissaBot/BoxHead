# BoxHead Zombie Survival Game - Claude Development Notes

## Project Overview

This is a 2D top-down local multiplayer zombie survival game built with JavaScript/HTML5 Canvas and packaged as a desktop application using Electron.

## Architecture & Design Decisions

### Technology Stack
- **Frontend**: HTML5 Canvas with JavaScript
- **Game Engine**: Custom-built using ES6 classes
- **Packaging**: Electron for cross-platform desktop distribution
- **Build System**: npm with electron-builder

### Core Components

#### 1. Game Engine (`js/game.js`)
- Main game loop with requestAnimationFrame
- Entity management (players, zombies, bullets)
- Wave-based progression system
- Collision detection and physics
- UI state management

#### 2. Entity System (`js/entities.js`)
- **Entity Base Class**: Position, velocity, radius, alive state
- **Player Class**: Health, ammo, shooting mechanics, dual control schemes
- **Zombie Class**: AI pathfinding, attack mechanics, health
- **Bullet Class**: Physics, lifetime, damage dealing

#### 3. Input System (`js/input.js`)
- **InputManager**: Centralized keyboard and mouse handling
- **PlayerController**: Separate control schemes for 2 players
  - Player 1: WASD movement + Mouse aiming/shooting
  - Player 2: Arrow keys movement + IJKL directional shooting

#### 4. Utilities (`js/utils.js`)
- Vector2 math class for 2D operations
- Collision detection functions
- Canvas drawing helpers
- Math utilities (clamp, lerp, random)

### Game Mechanics

#### Player System
- Health: 100 HP per player
- Ammo: 30 bullets per player (no reload system)
- Shooting cooldown: 200ms between shots
- Movement speed: 200 units per second

#### Zombie System
- Health: 50 HP per zombie
- Damage: 20 per attack
- Speed: Random between 50-100 units per second
- Attack cooldown: 1 second
- AI: Simple pathfinding toward nearest player

#### Wave System
- Formula: 5 + (wave - 1) * 3 zombies per wave
- Spawn locations: Random edges of screen
- Spawn interval: 2 seconds between spawns

#### Combat System
- Bullet damage: 25 HP
- Bullet speed: 500 units per second
- Bullet lifetime: 2 seconds
- Score: 100 points per zombie killed

### File Structure

```
BoxHead/
├── index.html              # Main game HTML with UI
├── js/
│   ├── main.js            # Entry point and initialization
│   ├── game.js            # Core game engine
│   ├── entities.js        # Game objects (Player, Zombie, Bullet)
│   ├── input.js           # Input handling for both players
│   └── utils.js           # Utility functions and math
├── electron-main.js        # Electron desktop app wrapper
├── package.json           # Build configuration and dependencies
├── build.bat             # Windows build script
├── .gitignore            # Git exclusions
├── README.md             # User documentation
└── CLAUDE.md             # This file - development notes
```

### Development Commands

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Build executable
npm run dist

# Quick build (Windows)
build.bat
```

### Key Design Patterns

#### Component-Based Architecture
- Separation of concerns: rendering, input, game logic
- Entity-component pattern for game objects
- Modular file structure for maintainability

#### Game Loop Pattern
- Fixed timestep with delta time calculations
- Update -> Render -> Repeat cycle
- Proper cleanup of dead entities

#### Observer Pattern
- UI updates based on game state changes
- Event-driven input handling

### Performance Considerations

#### Optimizations Implemented
- Object pooling avoided in favor of simplicity
- Efficient collision detection with early exits
- Canvas clearing optimized with single fillRect
- Delta time capping to prevent large frame jumps

#### Potential Improvements
- Spatial partitioning for collision detection with many entities
- Sprite batching for multiple similar entities
- Audio system integration
- Particle effects system

### Testing Strategy

#### Manual Testing Completed
- ✅ Both player movement systems
- ✅ Mouse and keyboard shooting mechanics
- ✅ Zombie AI pathfinding and attacking
- ✅ Collision detection accuracy
- ✅ Wave progression system
- ✅ UI state updates
- ✅ Game over conditions

#### Browser Compatibility
- Tested in modern browsers with HTML5 Canvas support
- Electron ensures consistent desktop experience

### Future Enhancement Ideas

#### Gameplay
- Weapon variety (shotgun, machine gun, etc.)
- Power-ups and pickups
- Different zombie types
- Environmental obstacles
- Cooperative objectives

#### Technical
- Save/load game state
- Settings menu (volume, graphics)
- Gamepad controller support
- Network multiplayer
- Mobile touch controls

#### Polish
- Sound effects and music
- Sprite graphics instead of geometric shapes
- Animations and particle effects
- Menu system with difficulty selection

### Known Limitations

1. **No ammo regeneration** - Players must manage limited ammunition
2. **Simple AI** - Zombies only use basic pathfinding
3. **Fixed canvas size** - Not responsive to window resizing
4. **No audio** - Silent gameplay experience
5. **Basic graphics** - Geometric shapes instead of sprites

### Maintenance Notes

#### Code Quality
- ES6 classes used throughout
- Clear separation of concerns
- Descriptive variable and function names
- Minimal dependencies for reduced complexity

#### Build System
- Electron builder configured for Windows, Mac, Linux
- Single executable output
- All assets bundled internally

This project demonstrates solid game development fundamentals with a clean, extensible architecture suitable for future enhancements.