import { BrowserWindow, app, ipcMain } from 'electron';
import { join } from 'path';
import { ObserverAPI } from '../../observer/observer';
import { dialog } from 'electron';

/**
 * Creates the window that displays the game state
 * @param observer - The observer that is used to update the window
 * @returns A promise that resolves when the window is ready to be shown
 */
export const createWindow = (observer: ObserverAPI) => {
  app.on('ready', () => {
    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      height: 800,
      width: 1200,
      show: true,
      webPreferences: {
        offscreen: false,
        sandbox: false,
        nodeIntegration: true,
        contextIsolation: true,
        preload: join(__dirname, '..', 'preload', 'preload.js')
      }
    };
    const window = new BrowserWindow(windowOptions);

    window.on('ready-to-show', () => {
      window.show();
    });

    window.loadFile('src/electron/renderer/index.html');

    ipcMain.on('next-state', () => observer.nextState());
    ipcMain.on('previous-state', () => observer.previousState());
    ipcMain.on('save-state', () => saveFileHelper(observer));
    observer.setUpdateViewCallback((html: string) => {
      window.webContents.send('update-view', html);
    });
    observer.setEndGameCallback(
      (gameStateHtml: string, endGameCardHtml: string) =>
        window.webContents.send('end-game', gameStateHtml, endGameCardHtml)
    );
  });
  return app.whenReady();
};

async function saveFileHelper(observer: ObserverAPI) {
  const { canceled, filePath } = await openDialog();
  if (!canceled && filePath) {
    observer.saveState(filePath);
  }
}

async function openDialog() {
  try {
    // Open the save dialog
    const results = await dialog.showSaveDialog({
      title: 'Select the File Path to save',
      buttonLabel: 'Save',
      // Specify the file type filters here
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: []
    });
    return results;
  } catch (err) {
    console.error('An error occurred: ', err);
    throw err;
  }
}
