import { Workspace } from '#/models/Editor';
import { Events } from '#/models/Events';
import { Epic } from '#/reducers';
import { executeScript } from '#/utils';
import * as ReactDOM from 'react-dom';
import { combineEpics } from 'redux-observable';
import { EMPTY, merge } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import actions from './actions';

const epics: Epic[] = [
  action$ =>
    action$.pipe(
      filter(actions.setCanvasInternals.match),
      switchMap(({ payload: { doc, element } }) => {
        const onClientBuild$ = Events.onClientBuild.builder(doc);
        const onCommitFiberRoot$ = Events.onCommitFiberRoot.builder(document);

        executeScript('http://localhost:9889/app.js', doc);

        return merge(
          onClientBuild$.pipe(
            map((e: any) => {
              const { detail } = e as { detail: Workspace };

              ReactDOM.render(
                detail.components[0].instances[0].element,
                element,
              );

              return actions.setWorkspace(detail);
            }),
          ),
          onCommitFiberRoot$.pipe(
            // tslint:disable-next-line:no-console
            tap(console.log),
            mergeMap(() => EMPTY),
          ),
        );
      }),
    ),
];

export default combineEpics(...epics);
