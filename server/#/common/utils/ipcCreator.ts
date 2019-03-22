import * as Electron from 'electron';
import * as ipc from 'electron-better-ipc';

export function mainToRendererRequest<T, P>(channel: string) {
  const callRenderer = (win: Electron.BrowserWindow, arg: T) =>
    ipc.callRenderer && ipc.callRenderer(win, channel, arg);
  const answerMain = (cb: (arg: T) => Promise<P>) =>
    ipc.answerMain && ipc.answerMain(channel, cb);

  return {
    callRenderer,
    answerMain,
  };
}
