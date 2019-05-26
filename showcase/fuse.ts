import { FuseBox } from 'fuse-box';
import tsTranformJsxSource from 'ts-transform-jsx-source';
import styledComponentSource from './styled-components-source';

const fuse = FuseBox.init({
  homeDir: 'src',
  target: 'browser@es6',
  output: 'dist/$name.js',
  transformers: {
    before: [tsTranformJsxSource, styledComponentSource],
  },
});

fuse.dev({ port: 9889 });

fuse
  .bundle('app')
  .instructions('> ellipsoid.tsx')
  .hmr()
  .watch('src/**');

fuse.run();
