module.exports = function(app, win) {

 return [
    {
      label: 'Storypalette Player',
      submenu: [                                
        {
          label: 'Toggle fullscreen',
          accelerator: 'Command+Shift+F',
          click: function() {
            win.setKiosk(!win.isKiosk());
          }
        },
        {
          label: 'Toggle dev tools',
          accelerator: 'Command+Alt+J',
          click: function() {
            win.toggleDevTools();
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
};
