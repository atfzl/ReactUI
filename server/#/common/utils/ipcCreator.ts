import * as Electron from 'electron';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import serializeError from 'serialize-error';

const ipcMain = (() => {
  if (process.type !== 'renderer') {
    return require('electron-better-ipc/source/main');
  }
})();

const ipcRenderer = (() => {
  if (process.type === 'renderer') {
    return require('electron-better-ipc/source/renderer');
  }
})();

export function mainToRendererRequest<T, P>(channel: string) {
  const callRenderer = (win: Electron.BrowserWindow, data: T) =>
    ipcMain && from(ipcMain.callRenderer(win, channel, data) as Promise<P>);
  const answerMain = (cb: (data: T) => Observable<P>) =>
    ipcRenderer &&
    ipcRenderer.answerMain(channel, (data: T) =>
      cb(data)
        .pipe(catchError(err => throwError(serializeError(err))))
        .toPromise(),
    );

  return {
    callRenderer,
    answerMain,
  };
}

export function rendererToMainRequest<T, P>(channel: string) {
  const callMain = (data: T) =>
    ipcRenderer && from(ipcRenderer.callMain(channel, data) as Promise<P>);
  const answerRenderer = (cb: (data: T) => Observable<P>) =>
    ipcMain &&
    ipcMain.answerRenderer(channel, (data: T) =>
      cb(data)
        .pipe(catchError(err => throwError(serializeError(err))))
        .toPromise(),
    );

  return {
    callMain,
    answerRenderer,
  };
}
