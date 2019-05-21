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

declare module 'react-frame-component' {
  const x: { default: any; FrameContextConsumer: any };
  export = x;
}

declare module 'nanoid' {
  const f: (size?: number) => string;
  export = f;
}
