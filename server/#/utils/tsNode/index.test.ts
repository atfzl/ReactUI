import { createSourceFile$ } from '#/utils/tsSourceFile';
import { pluck, switchMap } from 'rxjs/operators';
import * as ts from 'typescript';
import { findNode$ } from '.';

describe('findNode', () => {
  const getRootNode$ = createSourceFile$(
    `${__dirname}/__fixtures__/findNode.tsx`,
  ).pipe(pluck('file'));

  it('success', done => {
    getRootNode$.pipe(switchMap(findNode$(ts.isJsxElement))).subscribe(node => {
      expect(node).toMatchSnapshot();
      expect(node.getText()).toMatchSnapshot();
      done();
    });
  });

  it('fail', done => {
    getRootNode$.pipe(switchMap(findNode$(ts.isJsxFragment))).subscribe({
      error: x => {
        expect(x).toMatchSnapshot();
        done();
      },
    });
  });
});
