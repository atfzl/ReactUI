import { rootEpic, rootReducer, RootState } from '#/reducers';
import { applyMiddleware, createStore, Store } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

export function configureStore(initialState?: RootState) {
  const epicMiddleware = createEpicMiddleware();

  const middlewares = [epicMiddleware];

  if (process.env.NODE_ENV !== 'production') {
    const logger = require('redux-logger').createLogger({
      collapsed: true,
      diff: true,
    });

    middlewares.push(logger);
  }

  const middleware = applyMiddleware(...middlewares);

  const s = createStore(rootReducer, initialState!, middleware) as Store<
    RootState
  >;

  epicMiddleware.run(rootEpic as any);

  return s;
}

const store = configureStore();

export default store;
