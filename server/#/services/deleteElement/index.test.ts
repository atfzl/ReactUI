import { readFileToString$ } from '#/utils/file';
import { verifyFault } from '#/utils/test';
import { switchMap } from 'rxjs/operators';
import deleteElement from './index';

it('deletes child element', done => {
  const fileName = `${__dirname}/__fixtures__/1.tsx`;
  readFileToString$(fileName)
    .pipe(
      switchMap(deleteElement({ lineNumber: 5, columnNumber: 5, fileName })),
    )
    .subscribe(x => {
      expect(x).toMatchSnapshot();
      done();
    });
});

it('deletes element with no parent', done => {
  const fileName = `${__dirname}/__fixtures__/replaceWithNull1.tsx`;
  readFileToString$(fileName)
    .pipe(
      switchMap(deleteElement({ lineNumber: 3, columnNumber: 25, fileName })),
    )
    .subscribe(x => {
      expect(x).toMatchSnapshot();
      done();
    });
});

it('throws Fault if element at cursor is not found', done => {
  const fileName = `${__dirname}/__fixtures__/1.tsx`;

  readFileToString$(fileName)
    .pipe(
      switchMap(deleteElement({ lineNumber: 3, columnNumber: 7, fileName })),
    )
    .subscribe({
      error: x => {
        verifyFault(x);
        done();
      },
    });
});
