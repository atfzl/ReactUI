import { fromEvent } from 'rxjs';

export const EventListenerBuilders = {
  ON_CLIENT_BUILD: (doc: Document) => fromEvent(doc, 'beragi'),
  ON_COMMIT_FIBER_ROOT: (doc: Document) =>
    fromEvent(doc, 'beragi-ON_COMMIT_FIBER_ROOT'),
};
