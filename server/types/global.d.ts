declare module 'electron-better-ipc' {
  const x: {
    // main process
    callRenderer: <T, R>(
      win: Electron.BrowserWindow,
      channel: string,
      arg: T,
    ) => Promise<R>;
    answerRenderer: <T, R>(channel: string, fn: (arg: T) => Promise<R>) => void;
    sendToRenderers: <T, R>(channel: string, arg: T) => Promise<R>;

    // renderer process
    callMain: <T, R>(channel: string, arg: T) => Promise<R>;
    answerMain: <T, R = any>(
      channel: string,
      fn: (arg: T) => Promise<R>,
    ) => void;
  };
  export = x;
}

declare module 'react-dev-utils/launchEditor' {
  const x: any;
  export = x;
}

declare module 'electron-better-ipc*' {
  const x: any;
  export = x;
}
