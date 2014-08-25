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

  mainWindow = new BrowserWindow({width: 800, height: 600, title: 'Storypalette Player'});

  // Start in kiosk mode
  mainWindow.setKiosk(true);

  var menuTemplate = [
    {
      label: 'Storypalette Player',
      submenu: [                                
        {
          label: 'Toggle fullscreen',
          accelerator: 'Command+F',
          click: function() {
            mainWindow.setKiosk(!mainWindow.isKiosk());
          }
        },
        {
          label: 'Toggle dev tools',
          accelerator: 'Command+Alt+J',
          click: function() {
            mainWindow.toggleDevTools();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'About Storypalette Player',
          click: function() {
            dialog.showMessageBox({message: 'Storypalette Player v' + app.getVersion(), buttons:['ok']});
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            app.quit();
          }
        },
      ]
    }
  ];

  var menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.loadUrl(config.playerUrl);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  // IPC API: Called synchronously from renderer.
  ipc.on('getCredentials', function(event, arg) {
    event.returnValue = config.credentials;
  });
});

app.on('window-all-closed', function() {
  app.quit();
});
