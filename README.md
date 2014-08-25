# storypalette-player-app

## Install a pre-built release

- Download from http://github.com/storypalette/storypalette-player-app/releases
- Edit `config.json` and move it to `~/Library/Application\ Suppport/storypalette-player-app`

## Installing and building from scratch

### Prerequisites

- Node.js
- XCode

### Clone and build

```sh
git clone https://github.com/storypalette/storypalette-player-app.git
cd storypalette-player-app
./install.sh

cp config.json ~/Library/Application\ Suppport/storypalette-player-app/config.json
# Now, edit config.js with player username and password.

./build.sh
```

## Running

Double-click `Atom.app` or run from terminal 

```sh
./atom-shell/out/Release/Atom.app/Contents/MacOS/Atom
```

## Developing

Run `./build.sh` after making any changes.

## Deploying a new relese

- Update version in `package.json`
- Make sure Info.plist is correct.
- Make a new Github release.
