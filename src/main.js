const http = require('http');
const dmxPlayer = require('./dmxPlayer')();
const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
} = require('electron');

// Globals
const settings = {
  defaultWidth: 1024,
  defaultHeight: 768,
  windowDelay: 0,
  reconnectDelay: 5000,
  connectingUrl: 'file://' + __dirname + '/connecting.html',
};

let config;
let mainWindow;
let playerLoaded = false;

// Room info given to us soon by player.storypalette.net 
let room;

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

  hideMouseCursor();

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

  ipcMain.on('startDmx', function(event, roomData) {
    console.log('startDmx', roomData);
    room = roomData;
    dmxPlayer.start(room);
  });

  ipcMain.on('stopDmx', function(event) {
    console.log('stopDmx');
    dmxPlayer.shutdown();
  });

  // Async IPC
  ipcMain.on('dmxMessage', function(event, value) {
    console.log('dmxMessage', value.colour);
    dmxPlayer.message(value, room);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // TODO: shutdown dmx on all kinds of quitting
    dmxPlayer.shutdown();

    mainWindow = null;
  });
}

app.setKiosk = function(isKiosk) {
  mainWindow.setKiosk(isKiosk);

  // Only hide cursor if we're running in kiosk mode
  if (isKiosk) {
    mainWindow.webContents.on('dom-ready', () => {
      console.log('dom ready');
      hideMouseCursor(); 
    });
  }
}

// Inject cursor hiding CSS and, hrrm, force focus
// by programmatically clicking on the document
function hideMouseCursor() {
  mainWindow.webContents.insertCSS('html {cursor: none}');

  const bounds = require('electron').screen.getPrimaryDisplay().bounds;
  const x = bounds.width / 2;
  const y = bounds.height / 2;

  mainWindow.webContents.sendInputEvent({
    type: 'mouseDown',
    x,
    y,
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
      hideMouseCursor();
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
