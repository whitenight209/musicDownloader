'use strict'
import path from 'path';
import {app, protocol, BrowserWindow, ipcMain, dialog} from 'electron'
import NodeID3 from 'node-id3';
import {exec} from 'child_process';
import fs from 'fs';

const isBuild = process.env.NODE_ENV === 'production';

import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import winston from "winston";

import {getMusicDetail, getImage} from '@/util/api';
const isDevelopment = process.env.NODE_ENV !== 'production'

const sqlite3 = require('sqlite3').verbose();

// Keep a global reference of the window object, if you don't, the window will
let win;
let youtubeWindow;
// be closed automatically when the JavaScript object is garbage collected.
const getResourcePath = (dir) => {
    const pathToDbFile =
        // eslint-disable-next-line
        isBuild ? path.join(__dirname, `../src/${dir}`) : path.join(__dirname, 'bundled',dir)
    return pathToDbFile;
}
const logPath = getResourcePath('logs');
if (!fs.existsSync(logPath)) { fs.mkdirSync(logPath); }

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log', dirname: getResourcePath('logs')})
    ]
});
logger.info('app started');

// const db = new sqlite3.Database(path.resolve(__dirname, ''));
const db = new sqlite3.Database(getResourcePath('db/music.db'));
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}])

const checkIsDevelopment = () => {
    return !!process.env.WEBPACK_DEV_SERVER_URL;
}

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1024, height: 768, webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/home`)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html#home')
    }

    win.on('closed', () => {
        win = null
    })
}

const createYoutubeWindow = (data) => {
    if (youtubeWindow) {
        youtubeWindow.focus();
        youtubeWindow.webContents.send('2000', data);
        return;
    }
    youtubeWindow = new BrowserWindow({
        width: 400, height: 600, webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            webviewTag: true
        }
    });
    if (checkIsDevelopment()) {
        // Load the url of the dev server if in development mode
        youtubeWindow.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/youtube`)
        if (!process.env.IS_TEST) youtubeWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        youtubeWindow.loadURL('app://./index.html#youtube')
    }

    youtubeWindow.on('closed', () => {
        youtubeWindow = null
    })
    youtubeWindow.webContents.on('did-finish-load', () => {
        youtubeWindow.webContents.send('2000', data);
    })
};

ipcMain.on('1000', (e, data) => {
    createYoutubeWindow(data);
})
ipcMain.on('3000', (e, musicData) => {
    const stmt = db.prepare(
        `insert into 
        music (album_cover, album_name, artist_name, bugs_id, name, youtube_id)
         values(?, ?, ?, ?, ?, ?)`
    );
    stmt.run(Object.values(musicData), (err) => {
        if (err) {
            console.error(err)
        }
        console.info('insert success')
    })
})
ipcMain.on('song-db-list', () => {
    const promise = new Promise((resolve, reject) => {
        db.all(`select 
         album_cover as albumnCoverUrl, album_name, artist_name as artistName, bugs_id as key, name as songName, youtube_id as youtubeId
         from music`, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
    promise.then(data => {
        win.webContents.send('song-db-list', data);
    });
});

ipcMain.on('download-song', (event, data) => {

    if (!data.hasOwnProperty('youtubeId')) {
        return;
    }
    const makeCommand = (youtubeId, duration, downloadPath, fileName) => {
        return `${getResourcePath('libs/youtube-dl')} --extract-audio --audio-format mp3 --audio-quality 0 --ffmpeg-location ${getResourcePath('libs')} -o '${downloadPath}/${fileName}.%(ext)s' ${youtubeId} --postprocessor-args "-t ${duration}"`;
    }
    const command = (command) => {
        return new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
                if (err) reject(err);
                if (stderr) reject(stderr);
                resolve(stdout);
            });
        });
    }
    getMusicDetail(data.key).then(async bugsData => {
        /*
        * { musicDetail:
           { infoMapper:
              { '보컬': [Array], '작곡': [Array], '작사': [Array], '편곡': [Array] },
             albumHref: 'https://music.bugs.co.kr/album/20293803?wl_ref=S_tr_01_04',
             artist: '백예린',
             songName: 'Square (2017)',
             imgSrc:
              'https://image.bugsm.co.kr/album/images/200/202938/20293803.jpg',
             bugsSongId: 31780300,
             album: 'Every letter I sent you.',
             duration: '04:21' },
          albumDetail:
           { albumType: '정규',
             artist: [ '백예린' ],
             releaseDate: '2019.12.10',
             genre: [ '댄스/팝', '알앤비/소울' ],
             style: [ '알앤비', '팝' ],
             company: '블루바이닐',
             distributor: 'Dreamus' } }
        */
        const fileName = `${bugsData.musicDetail.artist}_${bugsData.musicDetail.songName.replace(" ", "_")}`;
        const downloadCommand = makeCommand(data.youtubeId, bugsData.musicDetail.duration, data.downloadPath, data.youtubeId);
        logger.info(downloadCommand);
        const result = await command(downloadCommand);
        console.log(result);
        logger.info(result);
        const musicPath = path.resolve(data.downloadPath, `${data.youtubeId}.mp3`);
        logger.info(musicPath)
        const imageData = Buffer.from(await getImage(bugsData.musicDetail.imgSrc), 'binary');
        NodeID3.write({
                title: bugsData.musicDetail.songName,
                artist: bugsData.musicDetail.artist,
                album: bugsData.musicDetail.album,
                image: imageData
            },
            musicPath);
        const newMusicFile = path.join(data.downloadPath, `${fileName}.mp3`);
        fs.renameSync(musicPath, newMusicFile);
        // performerInfo: "소속사"
        // composer: "작곡가"
        // genre: 장르 숫자
    }).catch(e => logger.info(e))
});

ipcMain.on('open-file-dialog', () => {
    dialog.showOpenDialog(win, {
        properties: ['openDirectory']
    }, fileName => {
        win.webContents.send('download-directory', fileName);
    })
})
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installVueDevtools()
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }

    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
