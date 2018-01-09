const electron = require('electron');
const fs = require('fs');
const app = electron.app;

const autoUpdater = require("electron-updater").autoUpdater;
const log = require("electron-log");

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

autoUpdater.logger = log;

const browserWindow = electron.BrowserWindow;
autoUpdater.on("checking-for-update", function (_arg1) {
    return log.info("Checking for update...");
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

app.on('ready', _ => {
    mainWindow = new browserWindow({
        width: 600,
        height: 450
    });

    mainWindow.loadURL('file://' + __dirname + '/src/index.html');
    log.info('starting app...')

    autoUpdater.checkForUpdatesAndNotify();

    log.info('autoUpdater.autoDownload: ' + autoUpdater.autoDownload);
    log.info('autoUpdater.currentVersion: ' + autoUpdater.currentVersion);
    log.info('autoUpdater.updateAvailable: ' + autoUpdater.updateAvailable);

    mainWindow.on('closed', _ => {
        mainWindow = null;
    })
});