import * as ts from 'typescript';
import { createSourceFile$ } from './index';

it('reads a file', done => {
  createSourceFile$(`${__dirname}/index.ts`).subscribe(x => {
    expect(ts.isSourceFile(x.file)).toBeTruthy();
    done();
  });
});
