import { fromEvent } from 'rxjs';

export const Events = {
  ON_CLIENT_BUILD: {
    name: 'beragi',
    eventListenerBuilder: (doc: Document) =>
      fromEvent(doc, Events.ON_CLIENT_BUILD.name),
  },
  ON_COMMIT_FIBER_ROOT: {
    name: 'beragi-ON_COMMIT_FIBER_ROOT',
    eventListenerBuilder: (doc: Document) =>
      fromEvent(doc, Events.ON_COMMIT_FIBER_ROOT.name),
  },
};
