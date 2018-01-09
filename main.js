process.env.NODE_ENV = isDev() ? 'development' : 'production';
var cfg = require('./config/' + process.env.NODE_ENV + '.js');

const electron = require('electron');
const app = electron.app;
const browserWindow = electron.BrowserWindow;

const log = require("electron-log");
const autoUpdater = require("electron-updater").autoUpdater;

require('electron-reload')(__dirname);

configureElectronLogging();
configureAutoUpdater();

app.on('ready', _ => {
    log.info('app ready...');

    createWindow();

    autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

function configureElectronLogging() {
    const fs = require('fs');
    // Same as for console transport
    log.transports.file.level = 'info';
    log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

    // Set approximate maximum log size in bytes. When it exceeds,
    // the archived log will be saved as the log.old.log file
    log.transports.file.maxSize = 5 * 1024 * 1024;

    // Write to this file, must be set before first logging
    log.transports.file.file = __dirname + '/log.txt';

    // fs.createWriteStream options, must be set before first logging
    // you can find more information at
    // https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
    log.transports.file.streamConfig = {
        flags: 'w'
    };

    // set existed file stream
    log.transports.file.stream = fs.createWriteStream('log.txt');

    log.info('configured electron logging...');
}

function configureAutoUpdater() {
    log.info('configuring AutoUpdater...');
    autoUpdater.logger = log;

    autoUpdater.on("checking-for-update", function (_arg1) {
        log.info("Checking for update...");
    });
    autoUpdater.on("update-available", function (_arg2) {
        return log.info("Update available.");
    });
    autoUpdater.on("update-not-available", function (_arg3) {
        return log.info("Update not available.");
    });
    autoUpdater.on("error", function (err) {
        return log.info("Error in auto-updater. " + err);
    });
    autoUpdater.on("download-progress", function (progressObj) {
        return log.info("downloading update");
    });

    autoUpdater.on("update-downloaded", function (_arg4) {
        log.info("Update downloaded");
        autoUpdater.quitAndInstall();
    });
}

function createWindow() {

    mainWindow = new browserWindow({
        width: 1024,
        height: 768
    });

    if (cfg.showDevTools) {
        mainWindow.openDevTools({detached: true});
    }

    mainWindow.loadURL('file://' + __dirname + '/src/index.html');

    mainWindow.on('closed', _ => {
        mainWindow = null;
    })
}

function isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
}