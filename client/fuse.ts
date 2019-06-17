// @ts-ignore
import * as copyDir from 'copy-dir';
import { FuseBox, SVGPlugin, WebIndexPlugin } from 'fuse-box';
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
  plugins: [WebIndexPlugin({ template: './#/index.html' }), SVGPlugin()],
  shim: {
    electron: { exports: "global.require('electron')" },
  },
});

fuse.dev({ port: 7979 });

let runOnce = false;

fuse
  .bundle('client')
  .instructions('> #/index.tsx')
  .hmr()
  .watch('#/**')
  .completed(() => {
    if (!runOnce) {
      copyDir('./#/fonts', './dist/fonts', {}, () => null);
      runOnce = true;
    }
  });

fuse.run();
