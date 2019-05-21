import { EventListenerBuilders } from '#/models/Events';
import { Epic } from '#/reducers';
import { executeScript } from '#/utils';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { combineEpics } from 'redux-observable';
import { EMPTY, merge } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import actions from './actions';

const epics: Epic[] = [
  action$ =>
    action$.pipe(
      filter(actions.setCanvasInternals.match),
      switchMap(({ payload: { doc, element } }) => {
        const onClientBuild$ = EventListenerBuilders.ON_CLIENT_BUILD(doc);
        const onCommitFiberRoot$ = EventListenerBuilders.ON_COMMIT_FIBER_ROOT(
          document,
        );

        executeScript('http://localhost:9889/app.js', doc);

        return merge(
          onClientBuild$.pipe(
            switchMap((e: any) => {
              const { detail } = e;

              ReactDOM.render(
                <>{detail.components[0].instances[0].instance}</>,
                element,
              );

              return EMPTY;
            }),
          ),
          onCommitFiberRoot$.pipe(
            // tslint:disable-next-line:no-console
            tap(console.log),
            switchMap(() => EMPTY),
          ),
        );
      }),
    ),
];

export default combineEpics(...epics);
