import { isReactElementIdentifier } from '#/common/api/GetRuntimeProps';
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

it('handle named as imports', done => {
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

it('handle imports path', done => {
  const sourceFile = fixtureFile(__dirname, 'source4.tsx');
  const targetFile = fixtureFile(__dirname, 't1/t2/target1.tsx');

  copyElement$(
    { fileName: sourceFile, lineNumber: 5, columnNumber: 5 },
    { fileName: targetFile, lineNumber: 4, columnNumber: 3 },
  ).subscribe(result => {
    expect(result).toMatchSnapshot();

    done();
  });
});

it('copies runtime props', done => {
  const { callRenderer } = require('electron-better-ipc/source/main');

  callRenderer.setMock({
    style: { backgroundColor: 'red' },
    date: 1559042696688,
    value: 'fopobar',
    content: isReactElementIdentifier,
    children: 'foobar',
  });

  const sourceFile = fixtureFile(__dirname, 'props/source1.tsx');
  const targetFile = fixtureFile(__dirname, 'props/target1.tsx');

  copyElement$(
    { fileName: sourceFile, lineNumber: 9, columnNumber: 7 },
    { fileName: targetFile, lineNumber: 4, columnNumber: 10 },
  ).subscribe(result => {
    expect(result).toMatchSnapshot();

    callRenderer.removeMock();

    done();
  });
});

it('copies runtime props with multiple children', done => {
  const { callRenderer } = require('electron-better-ipc/source/main');

  callRenderer.setMock({
    style: { backgroundColor: 'red' },
    date: 1559042696688,
    value: 'fopobar',
    content: isReactElementIdentifier,
    children: ['foobaring', 1],
  });

  const sourceFile = fixtureFile(__dirname, 'props/source2.tsx');
  const targetFile = fixtureFile(__dirname, 'props/target1.tsx');

  copyElement$(
    { fileName: sourceFile, lineNumber: 9, columnNumber: 7 },
    { fileName: targetFile, lineNumber: 4, columnNumber: 10 },
  ).subscribe(result => {
    expect(result).toMatchSnapshot();

    callRenderer.removeMock();

    done();
  });
});

it('copies runtime props with single children', done => {
  const { callRenderer } = require('electron-better-ipc/source/main');

  callRenderer.setMock({
    style: { backgroundColor: 'red' },
    date: 1559042696688,
    value: 'fopobar',
    content: isReactElementIdentifier,
    children: 2,
  });

  const sourceFile = fixtureFile(__dirname, 'props/source3.tsx');
  const targetFile = fixtureFile(__dirname, 'props/target1.tsx');

  copyElement$(
    { fileName: sourceFile, lineNumber: 9, columnNumber: 7 },
    { fileName: targetFile, lineNumber: 4, columnNumber: 10 },
  ).subscribe(result => {
    expect(result).toMatchSnapshot();

    callRenderer.removeMock();

    done();
  });
});

describe('recursive references', () => {
  it('common reference', done => {
    const sourceFile = fixtureFile(__dirname, 'recursive/source1.tsx');
    const targetFile = fixtureFile(__dirname, 'recursive/target1.tsx');

    copyElement$(
      { fileName: sourceFile, lineNumber: 12, columnNumber: 5 },
      { fileName: targetFile, lineNumber: 5, columnNumber: 5 },
    ).subscribe(result => {
      expect(result).toMatchSnapshot();

      done();
    });
  });

  it('check order of reference', done => {
    const sourceFile = fixtureFile(__dirname, 'recursive/source2.tsx');
    const targetFile = fixtureFile(__dirname, 'recursive/target2.tsx');

    copyElement$(
      { fileName: sourceFile, lineNumber: 12, columnNumber: 3 },
      { fileName: targetFile, lineNumber: 5, columnNumber: 5 },
    ).subscribe(result => {
      expect(result).toMatchSnapshot();

      done();
    });
  });
});
