// naming this file like this so that import auto sort keeps it at the top

import { Events } from '#/models/Events';
import { FiberRoot, Renderer } from '#/models/React';

const renderers: Record<string, Renderer> = {};

(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
  supportsFiber: true,
  inject: (renderer: Renderer) => {
    const rendererId = Math.random()
      .toString()
      .slice(2);

    renderers[rendererId] = renderer;

    return rendererId;
  },
  onCommitFiberRoot: (rendererId: string, fiberRoot: FiberRoot) => {
    const renderer = renderers[rendererId];

    const event = new CustomEvent(Events.onCommitFiberRoot.name, {
      detail: {
        rendererId,
        renderer,
        fiberRoot,
      },
    });

    document.dispatchEvent(event);
  },
  onCommitFiberUnmount: () => null,
};
