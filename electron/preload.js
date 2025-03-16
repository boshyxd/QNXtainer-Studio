import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld(
  'electron', {
    receive: (channel, func) => {
      const validChannels = ['navigate', 'app-info'];
      if (validChannels.includes(channel)) {
        ipcRenderer.removeAllListeners(channel);
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    send: (channel, data) => {
      const validChannels = ['toMain', 'window-control'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    windowControls: {
      minimize: () => ipcRenderer.send('window-control', 'minimize'),
      maximize: () => ipcRenderer.send('window-control', 'maximize'),
      close: () => ipcRenderer.send('window-control', 'close')
    },
    appInfo: {
      version: process.env.npm_package_version || '0.1.0',
      platform: process.platform
    }
  }
); 