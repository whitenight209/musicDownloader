'use strict';

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron';
import knex from 'knex';
import Events from '@/Event';
import Logger from '@/Logger';
import database from '@/util/database';
import { downloadYoutube } from '@/util/youtube';
import { getImage } from '@/util/api';
import { writeMetaData } from '@/util/musicUtils';
import fs from 'fs';
import {
  createProtocol
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';
const isBuild = process.env.NODE_ENV === 'production';
app.commandLine.appendSwitch('disable-web-security');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let youtubeWindow;
const getResourcePath = (dir) => {
  const pathToDbFile = isBuild ? path.join(__dirname, `../${dir}`) : path.join(__dirname, 'bundled', dir);
  return pathToDbFile;
};

const logFilePath = getResourcePath('logs/debug.log');
const logPath = getResourcePath('logs');
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}
const logger = new Logger(logFilePath, isBuild);
//
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: getResourcePath('db/music.db')
  },
  useNullAsDefault: true
});

// const db = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: getResourcePath('db/music.db')
//   }
// });
// const db = new Sqlite.Database(getResourcePath('db/music.db'));
// console.log(db)
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

ipcMain.on(Events.EVENT_OPEN_YOUTUBE_WINDOW, (event, musicDetail) => {
  createYoutubeWindow(musicDetail);
});
ipcMain.on(Events.EVENT_INSERT_MUSIC, (event, data) => {
  const musicDetail = data.musicDetail;
  logger.debug(data);
  // const albumDetail = data.albumDetail;
  database.insertMusic(db, {
    bugsId: musicDetail.bugsId,
    songName: musicDetail.songName,
    youtubeId: musicDetail.youtubeId,
    artistName: musicDetail.artist[0],
    albumName: musicDetail.albumName,
    albumCoverImage: musicDetail.imgSrc,
    albumId: musicDetail.bugsId,
    duration: musicDetail.duration
  }).then(data => {
    logger.debug(data);
  }).catch(err => {
    logger.debug(err);
  });
  logger.debug(data);
});
ipcMain.on(Events.EVENT_SELECT_MUSIC, (e, { page = 0, offset = 30 }) => {
  logger.debug('EVENT_SELECT_MUSIC');
  const musicList = database.selectMusic(db, { page, offset });
  musicList.then(musicList => {
    logger.debug(musicList);
    win.send(Events.EVENT_SELECT_MUSIC, musicList);
  });
});
ipcMain.on(Events.DELETE_STORED_MUSIC, (e, musicId) => {
  logger.debug('EVENT_DELETE_MUSIC');
  const deleteResult = database.deleteMusic(db, musicId);
  deleteResult.then(e => {
    win.send(Events.EVENT_REFRESH_ITEMS);
    logger.debug(`${e}`);
  });
});
ipcMain.on(Events.OPEN_FILE_DIALOG, e => {
  dialog.showOpenDialog(win, { properties: ['openDirectory'] })
    .then(({ canceled, filePaths }) => {
      if (!canceled) {
        const filePath = filePaths[0];
        logger.debug(`dialog choose directgory ${filePath}`);
        win.send(Events.OPEN_FILE_DIALOG, filePath);
      }
    });
});

ipcMain.on(Events.DOWNLOAD_MUSIC, async (e, { musicId, downloadPath }) => {
  logger.debug('EVENT_SELET_MUSIC');
  logger.debug(`music id ${musicId}`);
  let music = await database.selectMusicById(db, musicId);
  music = music[0];
  logger.debug(music);
  const libPath = getResourcePath('lib');
  const mp3FilePath = `${downloadPath}/${music.youtubeId}.mp3`;
  const newMp3FilePath = `${downloadPath}/${music.name.replace(' ', '_')}.mp3`;
  const result = await downloadYoutube(libPath, music.youtubeId, music.duration, downloadPath, music.youtubeId);
  const imageData = Buffer.from(await getImage(music.albumCoverImage), 'binary');
  writeMetaData(mp3FilePath, music.name, music.artistName, music.albumName, imageData);
  logger.debug(`download music ${music.name} result ${result}`);
  fs.renameSync(mp3FilePath, newMp3FilePath);
});
const createYoutubeWindow = (musicId) => {
  if (!youtubeWindow) {
    youtubeWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        webviewTag: true
      }
    });
  } else {
    youtubeWindow.focus();
  }
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    youtubeWindow.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/youtube`);
    if (!process.env.IS_TEST) youtubeWindow.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    youtubeWindow.loadURL('app://./index.html#youtube').then(() => console.log('load success')).catch(err => console.log(err));
  }
  youtubeWindow.on('closed', () => {
    logger.debug('youtube window closed');
    youtubeWindow = null;
  });
  youtubeWindow.webContents.once('dom-ready', () => {
    youtubeWindow.webContents.send(Events.EVENT_SET_MUSIC_DETAIL, musicId);
  });
};

const createWindow = () => {
  // Create the browser window.
  /* global __static */
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    icon: path.join(__static, 'icon.png')
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}`);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
    if (youtubeWindow) {
      youtubeWindow.close();
      youtubeWindow = null;
    }
  });
};
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
