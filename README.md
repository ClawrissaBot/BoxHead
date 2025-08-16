# BoxHead - Zombie Survival Game

A 2D top-down local multiplayer zombie survival game built with JavaScript/HTML5 Canvas.

## 🎮 Game Features

- **Local 2-Player Multiplayer** - Play with a friend on the same computer
- **Top-Down Zombie Survival** - Fight waves of increasingly difficult zombies
- **Weapon System** - Shoot zombies with limited ammo
- **Wave-based Gameplay** - Survive progressively harder waves
- **Health & Ammo Management** - Strategic resource management
- **Score System** - Compete for the highest score

## 🕹️ Controls

### Player 1 (Green)
- **Movement**: W, A, S, D keys
- **Aim**: Mouse cursor
- **Shoot**: Left mouse click (hold for continuous fire)

### Player 2 (Blue)  
- **Movement**: Arrow keys (↑, ↓, ←, →)
- **Aim & Shoot**: I, J, K, L keys (direction you press = direction you shoot)

## 🚀 How to Play

1. **Survive the Waves** - Zombies spawn at the edges and move toward players
2. **Shoot Zombies** - Use your weapons to eliminate threats
3. **Manage Resources** - Keep track of health and ammunition
4. **Work Together** - Coordinate with your teammate to survive longer
5. **Advance Waves** - Each wave brings more zombies with increasing difficulty

## 📋 Game Mechanics

- **Health**: Players start with 100 HP
- **Ammo**: 30 bullets per player (manage wisely!)
- **Zombie Damage**: Each zombie deals 20 damage on contact
- **Bullet Damage**: 25 damage per bullet
- **Scoring**: 100 points per zombie killed
- **Wave Progression**: 5 + (3 × wave number) zombies per wave

## 🛠️ Installation & Running

### Option 1: Run Directly in Browser
1. Open `index.html` in any modern web browser
2. Start playing immediately!

### Option 2: Build Executable
1. Install Node.js and npm
2. Run the build script:
   ```bash
   # On Windows
   build.bat
   
   # Or manually:
   npm install
   npm run dist
   ```
3. Find the executable in the `dist` folder

### Option 3: Run in Development
```bash
npm install
npm start
```

## 🎯 Tips & Strategy

- **Stay Mobile** - Keep moving to avoid zombie swarms
- **Conserve Ammo** - Make every shot count
- **Use Teamwork** - Cover each other's blind spots  
- **Control Spacing** - Don't let zombies surround you
- **Watch Your Health** - No healing available, play carefully!

## 🏗️ Technical Details

- **Engine**: Custom JavaScript game engine
- **Graphics**: HTML5 Canvas 2D
- **Input**: Keyboard + Mouse support
- **Physics**: Custom collision detection
- **AI**: Basic zombie pathfinding
- **Packaging**: Electron for desktop distribution

## 🎪 Game Files

- `index.html` - Main game HTML structure
- `js/main.js` - Game initialization and entry point  
- `js/game.js` - Core game engine and loop
- `js/entities.js` - Player, zombie, and bullet classes
- `js/input.js` - Input handling for both players
- `js/utils.js` - Utility functions and math helpers
- `electron-main.js` - Electron desktop app wrapper
- `package.json` - Build configuration
- `build.bat` - Windows build script

## 🎮 Have Fun!

Survive as long as you can and see how many waves you and your teammate can conquer together!