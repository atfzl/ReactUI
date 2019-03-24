import { readFileToString$ } from '#/utils/file';
import { switchMap } from 'rxjs/operators';
import deleteElement from './index';

it('deletes element', done => {
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
