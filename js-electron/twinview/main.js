const PATH = require('path');
const URL = require('url');

const Electron = require('electron');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Needed for grid layout to work
Electron.app.commandLine.appendSwitch('--enable-experimental-web-platform-features');

// When electron finished initializing
Electron.app.on('ready', function(){

    // Create the browser window.
    win = new Electron.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            experimentalFeatures: true
        }
    });

    // and load the index.html of the app.
    win.loadURL(URL.format({
        pathname: PATH.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win.on('closed', () => (win = null));
});

// Quit when all windows are closed.
Electron.app.on('window-all-closed', () => Electron.app.quit());
