import { fromEvent } from 'rxjs';

export const Events = {
  onClientBuild: {
    name: 'beragi',
    builder: (doc: Document) => fromEvent(doc, Events.onClientBuild.name),
  },
  onCommitFiberRoot: {
    name: 'beragi-ON_COMMIT_FIBER_ROOT',
    builder: (doc: Document) => fromEvent(doc, Events.onCommitFiberRoot.name),
  },
};
