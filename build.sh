echo "Building Storypalette Player App"

sudo rm -rf ./atom-shell/out/release/atom.app/contents/resources/app

cp -r app ./atom-shell/out/release/atom.app/contents/resources

echo "Done!"
