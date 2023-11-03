import { BrowserWindow, app } from "electron";

export const createWindow = (html: string) => {
  app.on("ready", () => {
    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      height: 500,
      width: 500,
      show: true,
      webPreferences: {
        offscreen: false,
        sandbox: false,
        nodeIntegration: true,
        contextIsolation: true,
      },
    };
    const window = new BrowserWindow(windowOptions);

    window.on("ready-to-show", () => {
      window.show();
    });

    window.loadURL("data:text/html;charset=utf-8," + html);
  });
};
