import { Epic } from '#/reducers';
import actions from '#/reducers/global/actions';
import { combineEpics } from 'redux-observable';
import { delay, filter, map } from 'rxjs/operators';

const epics: Epic[] = [
  action$ =>
    action$.pipe(
      filter(actions.ping.match),
      delay(2000),
      map(() => actions.pong()),
    ),
  action$ =>
    action$.pipe(
      filter(actions.pong.match),
      delay(2000),
      map(() => actions.ping()),
    ),
];

export default combineEpics(...epics);
