#! /bin/zsh

cp -R ./db ./dist_electron/bundled
cp -R ./conf ./dist_electron/bundled
cp -R ./lib ./dist_electron/bundled
chmod +x ./dist_electron/bundled/lib/*