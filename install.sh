# get atom shell
git clone https://github.com/atom/atom-shell.git

# build atom shell
echo "Building atom shell, this could take a while..."
./atom-shell/script/bootstrap.py
./atom-shell/script/build.py
