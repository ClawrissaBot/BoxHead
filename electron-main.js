const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        icon: path.join(__dirname, 'icon.png'),
        title: 'BoxHead - Zombie Survival',
        resizable: false,
        fullscreenable: true
    });

    // Load the index.html of the app
    mainWindow.loadFile('index.html');

    // Hide menu bar
    mainWindow.setMenuBarVisibility(false);

    // Optional: Open DevTools in development
    // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // On macOS, re-create a window when the dock icon is clicked
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});