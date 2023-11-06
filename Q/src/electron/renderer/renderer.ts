import { VIEW_BODY_ID } from '../../constants';

window.electronAPI.handleCounter(
  (_event: Electron.IpcRendererEvent, html: string) => {
    const viewBody = document.getElementById(VIEW_BODY_ID);
    if (viewBody) {
      viewBody.innerHTML = html;
    }
  }
);
