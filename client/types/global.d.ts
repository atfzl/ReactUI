declare module 'electron-better-ipc/*' {
  const x: any;
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
