import AppendEmptyStyledElementApi from '#/common/api/AppendEmptyStyledElement';
import CopyElementApi from '#/common/api/CopyElement';
import DeleteElementApi from '#/common/api/DeleteElement';
import FlushStylesApi from '#/common/api/FlushStyles';
import GetRuntimeProps, {
  isReactElementIdentifier,
} from '#/common/api/GetRuntimeProps';
import LaunchEditorApi from '#/common/api/LaunchEditor';
import { Events } from '#/models/Events';
import { Epic, RootState } from '#/reducers';
import { executeScript, getCursorFromId, parseStyles } from '#/utils';
import { getIdFromCursor, getTitle, walkTree } from '#/utils/fiberNode';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { combineEpics, StateObservable } from 'redux-observable';
import { concat, EMPTY, fromEvent, merge, of } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import * as voidElements from 'void-elements';
import actions from './actions';
import { NodeMap } from './interfaces';

const someOverlaySelected = (state$: StateObservable<RootState>) => () => {
  const {
    editor: {
      nodeMap,
      overlay: { selected },
    },
  } = state$.value;

  return !!selected && !!nodeMap[selected];
};

const someOverlayCopied = (state$: StateObservable<RootState>) => () => {
  const {
    editor: {
      overlay: { copied },
    },
  } = state$.value;

  return !!copied;
};

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
          merge(
            fromEvent<KeyboardEvent>(document, 'keydown').pipe(
              filter(
                e =>
                  (e.key === 'Delete' || e.key === 'Backspace') &&
                  e.metaKey &&
                  !e.repeat,
              ),
              filter(someOverlaySelected(state$)),
              mergeMap(() => {
                const {
                  editor: {
                    nodeMap,
                    overlay: { selected },
                  },
                } = state$.value;

                const cursor = nodeMap[selected!].fiberNode._debugSource!;

                return concat(
                  of(actions.setLoading(true)),
                  DeleteElementApi.callMain(cursor).pipe(
                    switchMap(() => EMPTY),
                  ),
                );
              }),
            ),
            fromEvent<KeyboardEvent>(document, 'keydown').pipe(
              filter(e => e.key === 'c' && e.metaKey && !e.repeat),
              filter(someOverlaySelected(state$)),
              map(() => {
                const {
                  editor: {
                    overlay: { selected },
                  },
                } = state$.value;

                return actions.setCopiedOverlay(selected);
              }),
            ),
            fromEvent<KeyboardEvent>(document, 'keydown').pipe(
              filter(e => e.key === 's' && e.metaKey && !e.repeat),
              filter(someOverlaySelected(state$)),
              switchMap(() => {
                const {
                  editor: {
                    overlay: { selected },
                    nodeMap,
                    canvas,
                  },
                } = state$.value;

                if (!canvas) {
                  return EMPTY;
                }

                const { fiberNode } = nodeMap[selected!];

                if (!fiberNode.type || !fiberNode.type.componentStyle) {
                  return EMPTY;
                }

                const {
                  lastClassName: hash,
                  componentId,
                } = fiberNode.type.componentStyle;

                const styleTag = canvas.doc.querySelector(
                  `[data-reactui=${hash}]`,
                );

                if (!styleTag) {
                  return EMPTY;
                }

                const styleStringArr = styleTag.textContent!.split('\n');

                styleStringArr.pop();
                styleStringArr.pop();

                const styleString = styleStringArr.slice(3).join('\n');

                const styleObject = parseStyles(styleString);

                const cursor = getCursorFromId(componentId);

                if (!cursor) {
                  return EMPTY;
                }

                return concat(
                  of(actions.setLoading(true)),
                  FlushStylesApi.callMain({ cursor, style: styleObject }).pipe(
                    switchMap(() => EMPTY),
                  ),
                );
              }),
            ),
            fromEvent<KeyboardEvent>(document, 'keydown').pipe(
              filter(e => e.key === 'v' && e.metaKey && !e.repeat),
              filter(
                () =>
                  someOverlaySelected(state$)() && someOverlayCopied(state$)(),
              ),
              mergeMap(() => {
                const {
                  editor: {
                    nodeMap,
                    overlay: { selected, copied },
                  },
                } = state$.value;

                const selectedNode = nodeMap[selected!].nativeNode;

                if (
                  selectedNode &&
                  voidElements[selectedNode.tagName.toLowerCase()]
                ) {
                  return EMPTY;
                }

                const source = nodeMap[copied!].fiberNode._debugSource!;
                const target = nodeMap[selected!].fiberNode._debugSource!;

                return concat(
                  of(actions.handleDrop({ source, target })),
                  of(actions.setCopiedOverlay(undefined)),
                );
              }),
            ),
            fromEvent<KeyboardEvent>(document, 'keydown').pipe(
              filter(e => e.key === 'Enter' && !e.repeat),
              filter(someOverlaySelected(state$)),
              switchMap(() => {
                const {
                  editor: {
                    overlay: { selected },
                    nodeMap,
                  },
                } = state$.value;

                const { fiberNode, nativeNode } = nodeMap[selected!];

                if (
                  nativeNode &&
                  voidElements[nativeNode.tagName.toLowerCase()]
                ) {
                  return EMPTY;
                }

                return concat(
                  of(actions.setLoading(true)),
                  AppendEmptyStyledElementApi.callMain({
                    cursor: fiberNode._debugSource!,
                    tagName: 'Div',
                  }).pipe(switchMap(() => EMPTY)),
                );
              }),
            ),
          ),
          onClientBuild$.pipe(
            switchMap(workspace => {
              const { selectedComponent } = state$.value.gallery;

              const selectedElement =
                workspace.components[selectedComponent[0]].instances[
                  selectedComponent[1]
                ].element;

              ReactDOM.render(selectedElement, element);

              return merge(
                of(actions.setWorkspace(workspace)),
                of(actions.setLoading(false)),
              );
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

              const {
                editor: {
                  overlay: { selected },
                },
              } = state$.value;

              const f = selected
                ? EMPTY
                : of(actions.setSelectedOverlay(undefined));

              return merge(
                f,
                of(
                  actions.onCommitFiberRoot({
                    rootFiberNode,
                    nodeMap,
                    renderer,
                  }),
                ),
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
        concat(
          of(actions.setLoading(true)),
          LaunchEditorApi.callMain(payload).pipe(
            switchMap(() => of(actions.setLoading(false))),
          ),
        ),
      ),
    ),
  action$ =>
    action$.pipe(
      filter(actions.handleDrop.match),
      switchMap(({ payload }) =>
        concat(
          of(actions.setLoading(true)),
          CopyElementApi.callMain(payload).pipe(switchMap(() => EMPTY)),
        ),
      ),
    ),
  (action$, state$) =>
    action$.pipe(() => {
      const mapPropValue = (value: React.ReactElement | any) => {
        if (React.isValidElement(value)) {
          return isReactElementIdentifier;
        }

        return value;
      };

      GetRuntimeProps.answerMain(cursor => {
        const {
          editor: { nodeMap },
        } = state$.value;

        const id = getIdFromCursor(cursor);

        if (!nodeMap[id]) {
          return of({});
        }

        const props = nodeMap[id].fiberNode.memoizedProps;

        return of(
          _.mapValues(props, value => {
            if (_.isArray(value)) {
              return value.map(mapPropValue);
            }

            return mapPropValue(value);
          }),
        );
      });

      return EMPTY;
    }),
  (action$, state$) =>
    action$.pipe(
      filter(actions.updatePreviewStyle.match),
      switchMap(({ payload }) => {
        const {
          editor: {
            nodeMap,
            overlay: { selected },
            canvas,
          },
        } = state$.value;

        if (!selected || !canvas) {
          return EMPTY;
        }

        if (!nodeMap[selected]) {
          return EMPTY;
        }

        const { fiberNode, nativeNode } = nodeMap[selected];

        if (!nativeNode) {
          return EMPTY;
        }

        if (fiberNode.type && fiberNode.type.componentStyle) {
          const hash = fiberNode.type.componentStyle.lastClassName;

          const className = `reactui-${hash}`;

          const styleString = `
            .${className}
            {
              ${payload.styles.map(ob => `${ob.key}: ${ob.value};`).join('\n')}
            }
          `;

          let styleTag = canvas.doc.querySelector(`[data-reactui=${hash}]`);

          if (!styleTag) {
            styleTag = canvas.doc.createElement('style');
            styleTag.setAttribute('data-reactui', hash);
            canvas.doc.head.appendChild(styleTag);
            nativeNode.classList.add(className);
            nativeNode.classList.remove(hash);
          }

          styleTag.textContent = styleString;
        }

        return EMPTY;
      }),
    ),
];

export default combineEpics(...epics);
