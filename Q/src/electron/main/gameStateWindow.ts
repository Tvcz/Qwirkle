import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'path';
import { ObserverAPI } from '../../observer/observer';
import { QTile } from '../../game/map/tile';

export const createWindow = (observer: ObserverAPI<QTile>) => {
  app.on('ready', () => {
    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      height: 500,
      width: 500,
      show: true,
      webPreferences: {
        offscreen: false,
        sandbox: false,
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join('..', 'preload', 'preload.js')
      }
    };
    const window = new BrowserWindow(windowOptions);

    window.on('ready-to-show', () => {
      window.show();
    });

    window.loadFile('../renderer/index.html');

    ipcMain.on('next-state', (_event) => observer.nextState());
    ipcMain.on('previous-state', (_event) => observer.previousState());
    ipcMain.on(
      'save-state',
      (_event: Electron.IpcMainEvent, filepath: string) =>
        observer.saveState(filepath)
    );
    observer.setUpdateViewCallback((html: string) =>
      window.webContents.send('update-view', html)
    );
    observer.setEndGameCallback(
      (gameStateHtml: string, endGameCardHtml: string) =>
        window.webContents.send('end-game', gameStateHtml, endGameCardHtml)
    );
  });
};
