# storypalette-player-app

## Usage

- Download the latest version from the Releases page.
- Create the file `~/Library/Application Suppport/Storypalette Player/config.js`. It should look like this: 

```js
module.exports = {
  // Player user's username and password
  credentials: {
    username: '<player username goes here>',
    password: '<player password goes here>'
  },

  // URL to the Player interface
  // Use 'http://player.storypalette.dev:8888' to connect to local version
  playerUrl: 'http://player.storypalette.net',

  // If true: start in fullscreen and hide mouse cursor
  kioskMode: true,

  // Wait this many ms before creating windows.
  // Useful in a kiosk environment with other applications running.
  windowDelay: 5000,
};
```

## Running

Double-click `Atom.app` or run from terminal 

```sh
./atom-shell/out/Release/Atom.app/Contents/MacOS/Atom
```

## Develop

### Get started

```sh
$ git clone https://github.com/storypalette/storypalette-player-app.git
$ npm install
$ npm start
```

### Development builds

```sh
$ npm run build
$ open dist/Storypalette Player-darwin-x64/Tjollen.app
```

### Deploy a new version

1. Commit your changes
2. `npm run build` to build the app
2. `npm run deploy` will bump npm version, create git tag and push to git
3. Manually upload the file in the `dist` folder to create a new Github release
