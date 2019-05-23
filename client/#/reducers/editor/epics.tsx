import { Events } from '#/models/Events';
import { Epic } from '#/reducers';
import { executeScript } from '#/utils';
import { combineEpics } from 'redux-observable';
import { EMPTY, merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import actions from './actions';

const epics: Epic[] = [
  action$ =>
    action$.pipe(
      filter(actions.setCanvasDomInternals.match),
      switchMap(({ payload: { doc } }) => {
        const onClientBuild$ = Events.onClientBuild.subscriberBuilder(doc);
        const onCommitFiberRoot$ = Events.onCommitFiberRoot.subscriberBuilder(
          document,
        );

        executeScript('http://localhost:9889/app.js', doc);

        return merge(
          onClientBuild$.pipe(map(e => actions.setWorkspace(e.detail))),
          onCommitFiberRoot$.pipe(switchMap(() => EMPTY)),
        );
      }),
    ),
];

export default combineEpics(...epics);
