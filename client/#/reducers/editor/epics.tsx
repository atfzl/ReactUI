import { Events } from '#/models/Events';
import { Epic } from '#/reducers';
import { executeScript } from '#/utils';
import { getTitle, walkTree } from '#/utils/fiberNode';
import * as ReactDOM from 'react-dom';
import { combineEpics } from 'redux-observable';
import { EMPTY, merge, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import actions from './actions';
import { NodeMap } from './interfaces';

const epics: Epic[] = [
  (action$, state$) =>
    action$.pipe(
      filter(actions.setCanvasDomInternals.match),
      switchMap(({ payload: { doc, element } }) => {
        const onClientBuild$ = Events.onClientBuild.subscriberBuilder(doc);
        const onCommitFiberRoot$ = Events.onCommitFiberRoot.subscriberBuilder(
          document,
        );

        executeScript('http://localhost:9889/app.js', doc);

        return merge(
          onClientBuild$.pipe(
            map(workspace => {
              const { selectedComponent } = state$.value.gallery;

              const selectedElement =
                workspace.components[selectedComponent[0]].instances[
                  selectedComponent[1]
                ].element;

              ReactDOM.render(selectedElement, element);

              return actions.setWorkspace(workspace);
            }),
          ),
          onCommitFiberRoot$.pipe(
            switchMap(({ fiberRoot, renderer }) => {
              if (fiberRoot.containerInfo !== element) {
                return EMPTY;
              }

              const rootFiberNode = fiberRoot.current;

              const nodeMap: NodeMap = {};

              walkTree(rootFiberNode, (node, depth) => {
                const title = getTitle(node);

                if (title) {
                  const nativeNode = renderer.findHostInstanceByFiber(
                    node,
                  ) as HTMLElement;

                  nodeMap[title] = { fiberNode: node, nativeNode, depth };
                }
              });

              return of(
                actions.onCommitFiberRoot({
                  rootFiberNode,
                  nodeMap,
                  renderer,
                }),
              );
            }),
          ),
        );
      }),
    ),
];

export default combineEpics(...epics);
