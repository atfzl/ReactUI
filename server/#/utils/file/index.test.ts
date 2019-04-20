import { fixtureFile, verifyFault } from '#/utils/test';
import { getPathRelativeToTarget, readFileToString$ } from './index';

describe('readFileToString$', () => {
  it('should give string of a text file', done => {
    readFileToString$(`${__dirname}/index.ts`).subscribe(text => {
      expect(typeof text).toMatch('string');
      done();
    });
  });

  it('should not work with something which is not a file', done => {
    readFileToString$(__dirname).subscribe({
      error: x => {
        verifyFault(x);
        done();
      },
    });
  });
});

describe('getPathRelativeToTarget', () => {
  it('should resolve .. paths', done => {
    getPathRelativeToTarget(
      fixtureFile(__dirname, 'source1.ts'),
      fixtureFile(__dirname, 'target1.ts'),
      '../../../',
    ).subscribe(result => {
      expect(result).toMatchSnapshot();
      done();
    });
  });

  it('should resolve ./ paths', done => {
    getPathRelativeToTarget(
      fixtureFile(__dirname, 'source1.ts'),
      fixtureFile(__dirname, 'target1.ts'),
      './target1',
    ).subscribe(result => {
      expect(result).toMatchSnapshot();
      done();
    });
  });

  it('should throw for invalid paths', done => {
    getPathRelativeToTarget(
      fixtureFile(__dirname, 'source1.ts'),
      fixtureFile(__dirname, 'target1.ts'),
      './targe1',
    ).subscribe({
      error: err => {
        verifyFault(err);
        done();
      },
    });
  });
});
