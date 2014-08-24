var app             = require('app');
var BrowserWindow   = require('browser-window');
var Menu            = require('menu')
var globalShortcut  = require('global-shortcut');
var ipc             = require('ipc');
var dialog          = require('dialog');

// Load config file, fail if not found.
var quit = false;
try {
  var config = require(process.env.HOME + '/Library/Application Support/storypalette-player-app/config.json');
} catch(err) {
  dialog.showMessageBox({message: err, buttons:['ok']});
  quit = true;
}

var mainWindow = null;

app.on('ready', function() {
  if (quit) {app.quit();}

  mainWindow = new BrowserWindow({width: 800, height: 600});
  //mainWindow.openDevTools();

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
