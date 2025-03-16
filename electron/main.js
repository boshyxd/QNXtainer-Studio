import { app, BrowserWindow, Menu, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#1a1a1a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/qnx-logo.svg')
  });

  const startUrl = process.env.ELECTRON_START_URL || new URL(path.join('file:', __dirname, '../dist/index.html')).href;
  
  mainWindow.loadURL(startUrl);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  const template = [
    {
      label: 'File',
      submenu: [
        { 
          label: 'New Container',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('navigate', 'containers-create')
        },
        { type: 'separator' },
        { 
          label: 'Exit',
          accelerator: 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { 
          label: 'Containers',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow.webContents.send('navigate', 'containers')
        },
        { 
          label: 'Images',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow.webContents.send('navigate', 'images')
        },
        { 
          label: 'Networks',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow.webContents.send('navigate', 'networks')
        },
        { 
          label: 'Volumes',
          accelerator: 'CmdOrCtrl+4',
          click: () => mainWindow.webContents.send('navigate', 'volumes')
        },
        { 
          label: 'Diagnostics',
          accelerator: 'CmdOrCtrl+5',
          click: () => mainWindow.webContents.send('navigate', 'diagnostics')
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://github.com/yourusername/qnxtainer-studio')
          }
        },
        {
          label: 'About QNXtainer',
          click: () => {
            mainWindow.webContents.send('navigate', 'about');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  ipcMain.on('window-control', (event, command) => {
    switch (command) {
      case 'minimize':
        mainWindow.minimize();
        break;
      case 'maximize':
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
        break;
      case 'close':
        mainWindow.close();
        break;
    }
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
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 