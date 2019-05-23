import { Workspace } from '#/models/Editor';
import { FiberRoot, OnCommitFiberRootPayload, Renderer } from '#/models/React';
import { fromEvent } from 'rxjs';

export const Events = {
  onClientBuild: (() => {
    const eventName = 'beragi';

    return {
      subscriberBuilder: (doc: Document) =>
        fromEvent<{
          detail: Workspace;
        }>(doc, eventName),
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
        }>(doc, eventName),
      emit: (doc: Document, payload: OnCommitFiberRootPayload) => {
        const event = new CustomEvent(eventName, {
          detail: payload,
        });

        doc.dispatchEvent(event);
      },
    };
  })(),
};
