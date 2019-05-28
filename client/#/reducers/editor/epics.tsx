import DeleteElementApi from '#/common/api/DeleteElement';
import LaunchEditorApi from '#/common/api/LaunchEditor';
import { Events } from '#/models/Events';
import { Epic } from '#/reducers';
import { executeScript } from '#/utils';
import { getTitle, walkTree } from '#/utils/fiberNode';
import * as ReactDOM from 'react-dom';
import { combineEpics } from 'redux-observable';
import { EMPTY, fromEvent, merge, of } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
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
          fromEvent<KeyboardEvent>(document, 'keydown').pipe(
            filter(
              e =>
                (e.key === 'Delete' || e.key === 'Backspace') &&
                e.metaKey &&
                !e.repeat,
            ),
            filter(() => {
              const {
                editor: {
                  nodeMap,
                  overlay: { selected },
                },
              } = state$.value;

              return !!selected && !!nodeMap[selected];
            }),
            mergeMap(() => {
              const {
                editor: {
                  nodeMap,
                  overlay: { selected },
                },
              } = state$.value;

              const cursor = nodeMap[selected!].fiberNode._debugSource!;

              return DeleteElementApi.callMain(cursor).pipe(
                switchMap(() => EMPTY),
              );
            }),
          ),
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
  action$ =>
    action$.pipe(
      filter(actions.launchEditorForCursor.match),
      switchMap(({ payload }) =>
        LaunchEditorApi.callMain(payload).pipe(switchMap(() => EMPTY)),
      ),
    ),
  action$ =>
    action$.pipe(
      filter(actions.handleDrop.match),
      switchMap(({ payload }) => {
        console.log('drag drop api call', payload);

        return EMPTY;
      }),
    ),
];

export default combineEpics(...epics);
