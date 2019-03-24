import { readFile, writeFile } from 'fs';
import * as R from 'ramda';
import { bindNodeCallback } from 'rxjs';
import { map } from 'rxjs/operators';

export const readFile$ = bindNodeCallback(readFile);
export const writeFile$ = bindNodeCallback(writeFile);
export const readFileToString$ = (fileName: string) =>
  readFile$(fileName).pipe(map(R.toString));

// export const removeExt = (str: string) => {
//   return str.slice(0, -path.extname(str).length);
// };
