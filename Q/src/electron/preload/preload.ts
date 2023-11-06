const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  nextState: () => ipcRenderer.send('next-state'),
  previousState: () => ipcRenderer.send('previous-state'),
  saveState: (filepath: string) => ipcRenderer.send('save-state', filepath),
  updateView: (
    updateViewHandler: (_event: Electron.IpcRendererEvent, html: string) => void
  ) => ipcRenderer.on('update-view', updateViewHandler)
});
