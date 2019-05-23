import { Events } from '#/models/Events';
import { Epic } from '#/reducers';
import { executeScript } from '#/utils';
import * as ReactDOM from 'react-dom';
import { combineEpics } from 'redux-observable';
import { EMPTY, merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import actions from './actions';

const epics: Epic[] = [
  (action$, state$) =>
    action$.pipe(
      filter(actions.setSelectedComponent.match),
      switchMap(() => {
        const { workspace, canvas } = state$.value.editor;
        const { selectedComponent } = state$.value.gallery;

        const element = canvas!.element;

        const selectedElement = workspace!.components[selectedComponent[0]]
          .instances[selectedComponent[1]].element;

        ReactDOM.render(selectedElement, element);

        return EMPTY;
      }),
    ),
  action$ =>
    action$.pipe(
      filter(actions.setCanvasInternals.match),
      switchMap(({ payload: { doc } }) => {
        const onClientBuild$ = Events.onClientBuild.subscriberBuilder(doc);

        executeScript('http://localhost:9889/app.js', doc);

        return merge(
          onClientBuild$.pipe(
            map(workspace => actions.setWorkspace(workspace)),
          ),
        );
      }),
    ),
];

export default combineEpics(...epics);
