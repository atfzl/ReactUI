import { createSourceFile$ } from './index';

it('reads a file', done => {
  createSourceFile$(`${__dirname}/index.ts`).subscribe(x => {
    expect(x).toHaveProperty('file');
    expect(x).toHaveProperty('text');
    expect(typeof x.text).toEqual('string');
    done();
  });
});
