import flushStyles$ from './index';

describe('no substitution template literal', () => {
  const fileNoSubstitutionTemplate1 = `${__dirname}/__fixtures__/noSubstitutionTemplate1.tsx`;

  it('success', done => {
    flushStyles$(
      {
        fileName: fileNoSubstitutionTemplate1,
        lineNumber: 3,
        columnNumber: 13,
      },
      { display: 'flex' },
    ).subscribe(result => {
      expect(result).toMatchSnapshot();
      done();
    });
  });
});

describe('substitution template literal', () => {
  const fileSubstitutionTemplate1 = `${__dirname}/__fixtures__/substitutionTemplate1.tsx`;

  it('should override static string in tail of last template', done => {
    flushStyles$(
      {
        fileName: fileSubstitutionTemplate1,
        lineNumber: 3,
        columnNumber: 13,
      },
      { display: 'flex' },
    ).subscribe(result => {
      expect(result).toMatchSnapshot();
      done();
    });
  });
});
