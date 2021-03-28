const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const dest = './dist_electron/';
console.log(os.platform());

let osPrefix = '';
switch (os.platform()) {
  case 'darwin':
    osPrefix = 'mac';
    break;
  case 'win32':
    osPrefix = 'win';
}

fs.mkdirpSync(dest);

fs.copySync('./conf/', path.join(dest, 'conf'));
fs.copySync('./db/', path.join(dest, 'db'));
fs.copySync(`./lib/${osPrefix}`, path.join(dest, 'lib'));
