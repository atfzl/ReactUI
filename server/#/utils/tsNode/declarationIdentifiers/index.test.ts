import { createSourceFile$ } from '#/utils/tsSourceFile';
import { pluck, switchMap, tap } from 'rxjs/operators';
import { getDeclarationIdentifiersAtSourceFile } from './index';

describe('all declarations', () => {
  const getRootNode$ = createSourceFile$(
    `${__dirname}/__fixtures__/declaration1.ts`,
  ).pipe(pluck('file'));

  it('success', done => {
    getRootNode$
      .pipe(
        switchMap(getDeclarationIdentifiersAtSourceFile),
        tap(node => expect(node.getText()).toMatchSnapshot()),
      )
      .subscribe(() => {
        done();
      });
  });
});
