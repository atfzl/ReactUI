import { Epic } from '#/reducers';
import { executeScript } from '#/utils';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { combineEpics } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import actions from './actions';

const epics: Epic[] = [
  action$ =>
    action$.pipe(
      filter(actions.setCanvasInternals.match),
      switchMap(({ payload: { doc, element } }) => {
        doc.addEventListener('icarus-build', (e: any) => {
          const { detail } = e;

          ReactDOM.render(
            <>{detail.components[0].instances[0].instance}</>,
            element,
          );
        });

        // tslint:disable-next-line:no-console
        document.addEventListener('beragi-commit-fiber-root', console.log);

        executeScript('http://localhost:9889/app.js', doc);
        return EMPTY;
      }),
    ),
];

export default combineEpics(...epics);
