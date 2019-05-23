import { Workspace } from '#/models/Editor';
import { FiberRoot, OnCommitFiberRootPayload, Renderer } from '#/models/React';
import { fromEvent } from 'rxjs';
import { pluck } from 'rxjs/operators';

export const Events = {
  onClientBuild: (() => {
    const eventName = 'beragi';

    return {
      subscriberBuilder: (doc: Document) =>
        fromEvent<{
          detail: Workspace;
        }>(doc, eventName).pipe(pluck('detail')),
    };
  })(),
  onCommitFiberRoot: (() => {
    const eventName = 'beragi-ON_COMMIT_FIBER_ROOT';

    return {
      subscriberBuilder: (doc: Document) =>
        fromEvent<{
          detail: {
            rendererId: string;
            renderer: Renderer;
            fiberRoot: FiberRoot;
          };
        }>(doc, eventName).pipe(pluck('detail')),
      emit: (doc: Document, payload: OnCommitFiberRootPayload) => {
        const event = new CustomEvent(eventName, {
          detail: payload,
        });

        doc.dispatchEvent(event);
      },
    };
  })(),
};
