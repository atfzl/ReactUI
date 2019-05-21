import { fromEvent } from 'rxjs';
import { Workspace } from './Editor';

export const Events = {
  onClientBuild: {
    name: 'beragi',
    builder: (doc: Document) =>
      fromEvent<{
        detail: Workspace;
      }>(doc, Events.onClientBuild.name),
  },
  onCommitFiberRoot: {
    name: 'beragi-ON_COMMIT_FIBER_ROOT',
    builder: (doc: Document) => fromEvent(doc, Events.onCommitFiberRoot.name),
  },
};
