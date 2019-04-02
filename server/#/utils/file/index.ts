import { Fault } from '#/common/models/Fault';
import { readFile, writeFile } from 'fs';
import * as R from 'ramda';
import { bindNodeCallback, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const readFile$ = bindNodeCallback(readFile);
export const writeFile$ = bindNodeCallback(writeFile);
export const readFileToString$ = (fileName: string) =>
  readFile$(fileName).pipe(
    catchError(err =>
      throwError(
        new Fault('Cannot read file', { error: JSON.stringify(err), fileName }),
      ),
    ),
    map(R.toString),
  );
