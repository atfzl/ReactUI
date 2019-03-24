import { readFileToString$ } from '#/utils/file';
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
