var app             = require('app');
var BrowserWindow   = require('browser-window');
var Menu            = require('menu')
var globalShortcut  = require('global-shortcut');
var config          = require('config');
var ipc             = require('ipc');

var mainWindow = null;

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  var toggleKiosk = function() {
    mainWindow.setKiosk(!mainWindow.isKiosk());
  };

  // Start in kiosk mode
  mainWindow.setKiosk(true);

  var menuTemplate = [
    {
      label: 'Storypalette Player',
      submenu: [                                
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            app.quit();
          }
        },
      ]
    },
    {
      submenu: [
        {
          label: 'Enter kiosk mode',
          accelerator: 'F',
          click: function() {
            mainWindow.setKiosk(true);
          }
        }
      ]
    },
    {
      label: 'User',
      submenu: [
        {
          label: 'Log out',
          click: function() {
            console.log("Logging out");
          }
        }
      ]
    }
  ];

  var menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  globalShortcut.register('f', function() { 
    toggleKiosk();
  });

  globalShortcut.register('esc', function() { 
    mainWindow.setKiosk(false);
  });

  mainWindow.loadUrl(config.playerUrl);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  // IPC API: Called synchronously.
  ipc.on('getCredentials', function(event, arg) {
    event.returnValue = config.credentials;
  });
});

app.on('window-all-closed', function() {
  app.quit();
});
