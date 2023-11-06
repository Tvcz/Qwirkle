import { IpcRenderer, IpcRendererEvent } from 'electron';

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
