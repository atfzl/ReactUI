import { FuseBox, WebIndexPlugin } from 'fuse-box';

const fuse = FuseBox.init({
  homeDir: '.',
  target: 'browser@es6',
  output: 'dist/$name.js',
  automaticAlias: false,
  alias: {
    '#': '~/#',
  },
  plugins: [WebIndexPlugin({ template: './#/index.html' })],
});

fuse.dev({ port: 7979 });

fuse
  .bundle('client')
  .instructions('> #/index.tsx')
  .hmr()
  .watch('#/**');

fuse.run();
