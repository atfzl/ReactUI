import { rootEpic, rootReducer, RootState } from '#/reducers';
import { applyMiddleware, createStore, Store } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function configureStore(initialState?: RootState) {
  const epicMiddleware = createEpicMiddleware();

  const middlewares = [epicMiddleware];

  if (process.env.NODE_ENV !== 'production') {
    const logger = require('redux-logger').createLogger({
      collapsed: true,
    });

    middlewares.push(logger);
  }

  const middleware = applyMiddleware(...middlewares);

  const store = createStore(rootReducer, initialState!, middleware) as Store<
    RootState
  >;

  const epic$ = new BehaviorSubject(rootEpic);
  // Every time a new epic is given to epic$ it
  // will unsubscribe from the previous one then
  // call and subscribe to the new one because of
  // how switchMap works
  const hotReloadingEpic = (...args: any) =>
    epic$.pipe(switchMap((epic: any) => epic(...args)));

  epicMiddleware.run(hotReloadingEpic as any);

  return store;
}

export default configureStore();
