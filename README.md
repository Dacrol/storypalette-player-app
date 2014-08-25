# storypalette-player-app

## Installing

### Prerequisites

- Node.js
- XCode

### Clone and build

```sh
git clone https://github.com/storypalette/storypalette-player-app.git
cd storypalette-player-app
./install.sh

cp configSample.json ~/Library/Application\ Suppport/storypalette-player-app/config.json
# Now, edit config.js with player username and password.

./build.sh
```

If atom-shell fails to build, download the latest release version from https://github.com/atom/atom-shell/releases. Then move `Atom.app` to `storypalette-player-app/atom-shell/out/release/`.

## Running

Double-click `Atom.app` or run from terminal 

```sh
./atom-shell/out/Release/Atom.app/Contents/MacOS/Atom
```

## Developing

Run `./build.sh` after making any changes.
