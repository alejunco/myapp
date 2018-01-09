const electron = require('electron');
const autoUpdater = require("electron-updater").autoUpdater;

const app = electron.app;
const browserWindow = electron.BrowserWindow;


app.on('ready', _ => {
    mainWindow = new browserWindow({
        width: 600,
        height: 450
    });

    mainWindow.loadURL('file://' + __dirname + '/src/index.html');

    autoUpdater.checkForUpdatesAndNotify();

    mainWindow.on('closed', _ => {
        mainWindow = null;
    })
})