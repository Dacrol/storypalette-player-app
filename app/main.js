var app             = require('app');
var BrowserWindow   = require('browser-window');
var Menu            = require('menu')
var globalShortcut  = require('global-shortcut');
var ipc             = require('ipc');
var dialog          = require('dialog');
var http            = require('http');

var reconnectDelay  = 5000;
var connectingUrl   = 'file://' + __dirname + '/connecting.html';

// Load config file, fail if not found.
var quit = false;
try {
  // TODO: Make platform independent.
  var config = require(process.env.HOME + '/Library/Application Support/Storypalette Player/config.js');
} catch(err) {
  dialog.showMessageBox({message: err, buttons:['ok']});
  quit = true;
}

var win  = null;
var playerLoaded = false;

app.on('ready', function() {
  if (quit) {app.quit();}

  win = new BrowserWindow({width: 800, height: 600, title: 'Storypalette Player'});
  var menuTemplate = require('./menu')(app, win );

  // Start in kiosk mode
  var kiosk = (typeof config.kioskMode === 'boolean') ? config.kioskMode : true;
  win.setKiosk(kiosk);

  var menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Show 'connecting' page until we have a connection...
  // Keep pinging server in case we lose connection.
  checkConnection(connCb);
  setInterval(checkConnection, reconnectDelay, connCb);

  win.on('closed', function() {
    win = null;
  });

  // IPC API: Called synchronously from renderer.
  ipc.on('getCredentials', function(event) {
    event.returnValue = config.credentials;
  });

  ipc.on('getPlayerUrl', function(event) {
    event.returnValue = config.playerUrl;
  });
});

var connCb = function(err) {
  if (err) {
    if (playerLoaded || !win.webContents.getUrl()) {
      win.loadUrl(connectingUrl);
      playerLoaded = false;
    }
    win.webContents.send('connectionStatus', err);
  } else {
    if (!playerLoaded) {
      win.loadUrl(config.playerUrl);
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


app.on('window-all-closed', function() {
  app.quit();
});
