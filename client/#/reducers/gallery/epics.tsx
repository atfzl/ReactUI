import { Events } from '#/models/Events';
import { Epic } from '#/reducers';
import { executeScript } from '#/utils';
import { combineEpics } from 'redux-observable';
import { merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import actions from './actions';

const epics: Epic[] = [
  action$ =>
    action$.pipe(
      filter(actions.setCanvasInternals.match),
      switchMap(({ payload: { doc } }) => {
        const onClientBuild$ = Events.onClientBuild.builder(doc);

        executeScript('http://localhost:9889/app.js', doc);

        return merge(
          onClientBuild$.pipe(map(e => actions.setWorkspace(e.detail))),
        );
      }),
    ),
];

export default combineEpics(...epics);
