import { contextBridge, ipcRenderer } from 'electron';
import {
  END_GAME,
  NEXT_STATE,
  PREVIOUS_STATE,
  SAVE_STATE,
  UPDATE_VIEW
} from '../../constants';

// Exposes the electron API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  nextState: () => ipcRenderer.send(NEXT_STATE),
  previousState: () => ipcRenderer.send(PREVIOUS_STATE),
  saveState: () => ipcRenderer.send(SAVE_STATE),
  updateViewHandler: (
    updateView: (_event: Electron.IpcRendererEvent, html: string) => void
  ) => ipcRenderer.on(UPDATE_VIEW, updateView),
  endGameHandler: (
    endGame: (
      _event: Electron.IpcRendererEvent,
      gameStateHtml: string,
      endGameCardHtml: string
    ) => void
  ) => ipcRenderer.on(END_GAME, endGame)
});
