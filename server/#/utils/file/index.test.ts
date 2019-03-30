import { readFileToString$ } from './index';

it('should give string of a text file', done => {
  readFileToString$(`${__dirname}/index.ts`).subscribe(text => {
    expect(typeof text).toMatch('string');
    done();
  });
});

it('should not work with something which is not a file', done => {
  readFileToString$(__dirname).subscribe({
    error: x => {
      expect(x).toMatchSnapshot();
      done();
    },
  });
});
