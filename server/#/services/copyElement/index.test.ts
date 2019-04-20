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

it('handle named imports', done => {
  const sourceFile = fixtureFile(__dirname, 'source2.tsx');
  const targetFile = fixtureFile(__dirname, 'source2.tsx');

  copyElement$(
    { fileName: sourceFile, lineNumber: 6, columnNumber: 5 },
    { fileName: targetFile, lineNumber: 7, columnNumber: 5 },
  ).subscribe(result => {
    expect(result).toMatchSnapshot();

    done();
  });
});

it.only('handle named as imports', done => {
  const sourceFile = fixtureFile(__dirname, 'source3.tsx');
  const targetFile = fixtureFile(__dirname, 'source3.tsx');

  copyElement$(
    { fileName: sourceFile, lineNumber: 6, columnNumber: 5 },
    { fileName: targetFile, lineNumber: 7, columnNumber: 5 },
  ).subscribe(result => {
    expect(result).toMatchSnapshot();

    done();
  });
});
