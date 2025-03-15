const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    receive: (channel, func) => {
      // Deliberately limit the channels that can be received
      const validChannels = ['navigate'];
      if (validChannels.includes(channel)) {
        // Remove the event listener to avoid memory leaks
        ipcRenderer.removeAllListeners(channel);
        // Add a new listener
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    send: (channel, data) => {
      // Deliberately limit the channels that can be sent
      const validChannels = ['toMain'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    }
  }
); 