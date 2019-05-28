import { FuseBox, WebIndexPlugin } from 'fuse-box';
import { TypeChecker } from 'fuse-box-typechecker';

const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const typechecker = TypeChecker({
    tsConfig: './tsconfig.json',
    basePath: '.',
  });

  typechecker.runWatch('./#');
}

const fuse = FuseBox.init({
  homeDir: '.',
  target: 'electron',
  output: 'dist/$name.js',
  automaticAlias: false,
  alias: {
    '#': '~/#',
  },
  plugins: [WebIndexPlugin({ template: './#/index.html' })],
  shim: {
    electron: { exports: "global.require('electron')" },
  },
});

fuse.dev({ port: 7979 });

fuse
  .bundle('client')
  .instructions('> #/index.tsx')
  .hmr()
  .watch('#/**');

fuse.run();
