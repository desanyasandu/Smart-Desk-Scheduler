const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startURL = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Data Storage Logic
const DATA_PATH = path.join(app.getPath('userData'), 'data.json');

const defaultData = {
  users: [],
  timetable: [],
  tasks: [],
  history: []
};

function readData() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// IPC Handlers
ipcMain.handle('get-data', async () => {
  return readData();
});

ipcMain.handle('save-data', async (event, data) => {
  saveData(data);
  return { success: true };
});

ipcMain.handle('notify', (event, { title, body }) => {
  new Notification({ title, body }).show();
});
