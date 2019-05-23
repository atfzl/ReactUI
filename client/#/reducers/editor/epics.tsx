import { Events } from '#/models/Events';
import { Epic } from '#/reducers';
import { executeScript } from '#/utils';
import { combineEpics } from 'redux-observable';
import { merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import actions from './actions';

const epics: Epic[] = [
  (action$, state$) =>
    action$.pipe(
      filter(actions.setCanvasDomInternals.match),
      switchMap(({ payload: { doc } }) => {
        const onClientBuild$ = Events.onClientBuild.subscriberBuilder(doc);
        const onCommitFiberRoot$ = Events.onCommitFiberRoot.subscriberBuilder(
          document,
        );

        executeScript('http://localhost:9889/app.js', doc);

        return merge(
          onClientBuild$.pipe(
            map(workspace => {
              return actions.setWorkspace(workspace);
            }),
          ),
          onCommitFiberRoot$.pipe(
            map(payload => {
              const { element } = state$.value.editor.canvas!;
              const fiberNode = payload.renderer.findFiberByHostInstance(
                element,
              );

              return actions.onCommitFiberRoot({
                fiberNode: fiberNode.child,
                nodeMap: {},
                renderer: payload.renderer,
              });
            }),
          ),
        );
      }),
    ),
];

export default combineEpics(...epics);
