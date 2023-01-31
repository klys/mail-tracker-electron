/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { print } from 'pdf-to-printer';
import stickerGenerator from './stickerGenerator';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

// import {setDbPath, executeMany, executeQuery,executeScript} from 'sqlite-electron';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('test', async (event, data, data2) => {
  try {
    console.log(`testing ipcMain${data}`);
    console.log(`second data: ${data2}`);
    return data;
  } catch (error) {
    return error;
  }
});

// DB ipcMain

const connectDB = async () => {
  const dbfile = 'data.db';
  if (fs.existsSync(`./assets/${dbfile}`)) {
    return open({
      filename: `./assets/${dbfile}`,
      driver: sqlite3.Database,
    });
  }
  // TODO: Create DB if do not exists
  console.log('DB does not exist');
};

// DB providers

ipcMain.handle('db-select-providers', async (event) => {
  const db = await connectDB();
  let Middle = [];
  const result = await db.all('SELECT * FROM providers').then((values) => {
    Middle = values;
  });
  return Middle;
});

ipcMain.handle('db-delete-provider', async (event, data) => {
  const db = await connectDB();
  const result = await db.run(`DELETE FROM providers WHERE id = ${data.id}`);
  return result;
});

ipcMain.handle('db-insert-provider', async (event, data) => {
  const db = await connectDB();
  const result = await db.run(
    'INSERT INTO providers (code, name, logo) VALUES (?, ?, ?)',
    data.code,
    data.name,
    data.logo
  );
  return result;
});

ipcMain.handle('db-update-provider', async (event, data) => {
  const db = await connectDB();
  const result = await db.run(
    'UPDATE providers SET name = ?, code = ? WHERE id = ?',
    data.name,
    data.code,
    data.id
  );
  return result;
});

ipcMain.handle('db-search-providers', async (event, data) => {
  const db = await connectDB();

  let Middle = [];

  if (data.name !== '')
    await db
      .all(
        `SELECT id, name, code FROM providers WHERE name LIKE '${data.name}%';`
      )
      .then((values) => {
        Middle = values;
      });
  return Middle;
});

// DB people

ipcMain.handle('db-select-peoples', async (event) => {
  const db = await connectDB();
  let Middle = [];
  await db.all('SELECT * FROM people').then((values) => {
    Middle = values;
  });
  return Middle;
});

ipcMain.handle('db-delete-poeple', async (event, data) => {
  const db = await connectDB();
  const result = await db.run(`DELETE FROM people WHERE id = ${data.id}`);
  return result;
});

ipcMain.handle('db-insert-people', async (event, data) => {
  const db = await connectDB();
  const result = await db.run(
    'INSERT INTO people (location, name, photo, email) VALUES (?, ?, ?, ?)',
    data.location,
    data.name,
    data.photo,
    data.email
  );
  return result;
});

ipcMain.handle('db-update-people', async (event, data) => {
  const db = await connectDB();
  const result = await db.run(
    'UPDATE people SET name = ?, location = ?, email = ? WHERE id = ?',
    data.name,
    data.location,
    data.email,
    data.id
  );
  return result;
});

ipcMain.handle('db-search-people', async (event, data) => {
  const db = await connectDB();

  let Middle = [];

  if (data.name !== '')
    await db
      .all(
        `SELECT id, name, location FROM people WHERE name LIKE '${data.name}%';`
      )
      .then((values) => {
        Middle = values;
      });
  return Middle;
});

function base64_encode(file: string) {
  // read binary data
  const bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

ipcMain.handle('file-test', async (event, data) => {
  // let middle = '';
  fs.writeFile('./assets/print.pdf', data.file, (err) => {
    if (err) return console.log(err);
    console.log('print.pdf saved.');
    print('./assets/print.pdf').then(console.log);
    // middle = base64_encode('./assets/print.pdf');
  });

  // return middle;
});

ipcMain.handle('gen-n-print-sticker', async (event, data) => {
  await stickerGenerator(
    data.name,
    data.location,
    data.sender,
    data.date,
    data.code
  ).then(() => {
    print(`./assets/stickers/${data.code}.pdf`);
  });

});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
