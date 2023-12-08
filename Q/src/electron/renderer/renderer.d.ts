import { IpcRenderer, IpcRendererEvent } from 'electron';

/**
 * Interface for the electron API exposed to the renderer process. This allows
 * the renderer to indirectly call functions in the main process, specifically
 * those on an ObserverAPI object.
 */
export interface IElectronAPI {
  nextState: () => void;
  previousState: () => void;
  saveState: (filepath: string) => void;
  updateView: (
    updateViewHandler: (_event: IpcRendererEvent, html: string) => void
  ) => IpcRenderer;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
