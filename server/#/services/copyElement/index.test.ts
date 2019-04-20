import { fixtureFile } from '#/utils/test';
import copyElement$ from './index';

it('should work', done => {
  const sourceFile = fixtureFile(__dirname, 'source1.tsx');
  const targetFile = fixtureFile(__dirname, 'target1.tsx');

  copyElement$(
    { fileName: sourceFile, lineNumber: 16, columnNumber: 3 },
    { fileName: targetFile, lineNumber: 5, columnNumber: 5 },
  ).subscribe(result => {
    expect(result).toMatchSnapshot();

    done();
  });
});
