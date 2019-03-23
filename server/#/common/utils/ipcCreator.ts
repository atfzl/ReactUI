import * as Electron from 'electron';
import * as ipc from 'electron-better-ipc';
import serializeError from 'serialize-error';

export function mainToRendererRequest<T, P>(channel: string) {
  const callRenderer = (win: Electron.BrowserWindow, arg: T) =>
    ipc.callRenderer && ipc.callRenderer(win, channel, arg);
  const answerMain = (cb: (arg: T) => Promise<P>) =>
    ipc.answerMain &&
    ipc.answerMain(channel, (a: T) =>
      cb(a).catch(err => Promise.reject(serializeError(err))),
    );

  return {
    callRenderer,
    answerMain,
  };
}

export function rendererToMainRequest<T, P>(channel: string) {
  const callMain = (arg: T) => ipc.callMain && ipc.callMain<T, P>(channel, arg);
  const answerRenderer = (cb: (arg: T) => Promise<P>) =>
    ipc.answerRenderer &&
    ipc.answerRenderer(channel, (a: T) =>
      cb(a).catch(err => Promise.reject(serializeError(err))),
    );

  return {
    callMain,
    answerRenderer,
  };
}
