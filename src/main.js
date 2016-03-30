const http = require('http');
const electron = require('electron');
const dmxpro = require('dmxpro');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;


// Globals
const settings = {
  defaultWidth: 800,
  defaultHeight: 600,
  windowDelay: 0,
  reconnectDelay: 5000,
  connectingUrl: 'file://' + __dirname + '/connecting.html',
};

let config;
let mainWindow;
let playerLoaded = false;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: settings.defaultWidth, 
    height: settings.defaultHeight, 
    title: 'Storypalette Player'
  });

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Create menus
  var menuTemplate = require('./menu')(app, mainWindow);
  var menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Run in fullscreen?
  const isKiosk = (typeof config.kioskMode === 'boolean') ? config.kioskMode : true;
  app.setKiosk(isKiosk);

  // Show 'connecting' page until we have a connection...
  // Keep pinging server in case we lose connection.
  checkConnection(connCb);
  setInterval(checkConnection, settings.reconnectDelay, connCb);

  // IPC API: Called synchronously from renderer.
  ipcMain.on('getCredentials', function(event) {
    event.returnValue = config.credentials;
  });

  ipcMain.on('getPlayerUrl', function(event) {
    event.returnValue = config.playerUrl;
  });

  // Async IPC
  ipcMain.on('dmxMessage', function(event, value) {
    console.log('dmxMessage', value);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.setKiosk = function(flag) {
  mainWindow.setKiosk(flag);

  if (flag) {
    hideMouseCursor();
  }
}

// Inject cursor hiding CSS and, hrrm, force focus
// by programmatically clicking on the document
function hideMouseCursor() {
  mainWindow.webContents.insertCSS('html {cursor: none}');

  const bounds = electron.screen.getPrimaryDisplay().bounds;

  mainWindow.webContents.sendInputEvent({
    type: 'mouseDown',
    x: bounds.width / 2,
    y: bounds.height / 2,
  });
}

var connCb = function(err) {
  if (err) {
    if (playerLoaded || !mainWindow.webContents.getURL()) {
      mainWindow.loadURL(settings.connectingUrl);
      playerLoaded = false;
    }
    mainWindow.webContents.send('connectionStatus', err);
  } else {
    if (!playerLoaded) {
      mainWindow.loadURL(config.playerUrl);
      playerLoaded = true;
    }
  } 
};

var checkConnection = function(cb) {
  var req = http.get(config.playerUrl + '/ping', function(res) {
    if (res.statusCode !== 200) {
      cb({code: 'ESERVER'});
    } else {
      cb();
    }
  });
  req.on('error', function(err) {
    cb(err);
  });
};


// Entry point 
app.on('ready', function() {
  // Load config file, fail if not found.
  try {
    config = require(app.getPath('appData') + '/Storypalette Player/config.js');
  } catch(err) {
    dialog.showMessageBox({message: 'Failed to load config.js file!\n\n' + err, buttons:['OK']});
    app.quit();
  }

  // Maybe wait a bit before opening the window
  setTimeout(
    createWindow,
    config.windowDelay || settings.windowDelay || 0
  );
});

app.on('window-all-closed', function() {
  app.quit();
});
