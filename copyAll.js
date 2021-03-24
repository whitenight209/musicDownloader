const fs = require('fs-extra');
const path = require('path');
const dest = './dist_electron/';
fs.mkdirpSync(dest);
fs.copySync('./conf/', path.join(dest, 'conf'));
fs.copySync('./db/', path.join(dest, 'db'));
fs.copySync('./lib/', path.join(dest, 'lib'));
