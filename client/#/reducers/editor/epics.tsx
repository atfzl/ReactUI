import { Events } from '#/models/Events';
import { Epic } from '#/reducers';
import { executeScript } from '#/utils';
import { getTitle, walkTree } from '#/utils/fiberNode';
import { combineEpics } from 'redux-observable';
import { EMPTY, merge, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import actions from './actions';
import { NodeMap } from './interfaces';

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
            switchMap(payload => {
              const { canvas } = state$.value.editor;

              if (!canvas) {
                return EMPTY;
              }

              const fiberRootNode = payload.renderer.findFiberByHostInstance(
                canvas.element,
              );

              const nodeMap: NodeMap = {};

              walkTree(fiberRootNode, (node, depth) => {
                const title = getTitle(node);

                if (title) {
                  const nativeNode = payload.renderer.findHostInstanceByFiber(
                    node,
                  ) as HTMLElement;

                  nodeMap[title] = { fiberNode: node, nativeNode, depth };
                }
              });

              return of(
                actions.onCommitFiberRoot({
                  fiberRootNode,
                  nodeMap,
                  renderer: payload.renderer,
                }),
              );
            }),
          ),
        );
      }),
    ),
];

export default combineEpics(...epics);
