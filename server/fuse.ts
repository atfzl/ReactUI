/**
 * This file handle the main part of the electron app
 */

import { ChildProcess, spawn } from 'child_process';
import { FuseBox } from 'fuse-box';

const fuse = FuseBox.init({
  homeDir: '.',
  output: 'dist/$name.js',
  sourceMaps: true,
  automaticAlias: false,
  alias: {
    '#': '~/#',
  },
});

let electronProcess: ChildProcess;

fuse
  .bundle('server')
  .target('electron')
  .instructions(' > [#/index.ts]')
  .watch('**')
  .completed(() => {
    if (electronProcess && electronProcess.pid) {
      process.kill(-electronProcess.pid, 'SIGKILL');
    }

    electronProcess = spawn('electron', [__dirname], {
      stdio: 'inherit',
      detached: true,
    }).on('exit', code => {
      if (code !== null) {
        // tslint:disable-next-line:no-console
        console.log(`electron process exited with code ${code}`);

        process.exit(code);
      }
    });
  });

process.on('SIGINT', () => {
  process.kill(-electronProcess.pid);
});

fuse.run();
