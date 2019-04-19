import copyElement$ from './index';

it('should work', done => {
  const sourceFile = `${__dirname}/__fixtures__/source1.tsx`;
  const targetFile = `${__dirname}/__fixtures__/target1.tsx`;

  copyElement$(
    { fileName: sourceFile, lineNumber: 11, columnNumber: 3 },
    { fileName: targetFile, lineNumber: 5, columnNumber: 5 },
  ).subscribe(result => {
    console.log(result);

    done();
  });
});
