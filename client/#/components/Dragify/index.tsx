import { TagCursor } from '#/common/models/file';
import Ref from '#/components/Ref';
import * as React from 'react';
import {
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DropTarget,
  DropTargetConnector,
} from 'react-dnd';
import { findDOMNode } from 'react-dom';

const dragSource = {
  beginDrag(props: Props) {
    return { cursor: props.cursor };
  },
};

const dragCollect = (
  connect: DragSourceConnector,
  monitor: DragSourceMonitor,
) => ({
  connectDragSource: connect.dragSource(),
  sourceItem: monitor.getItem(),
});

const dropTarget = {
  drop(props: Props) {
    props.onDrop({ source: props.sourceItem.cursor, target: props.cursor });
  },
};

const dropCollect = (connect: DropTargetConnector) => ({
  connectDropTarget: connect.dropTarget(),
});

type DragCollectProps = ReturnType<typeof dragCollect>;
type DropCollectProps = ReturnType<typeof dropCollect>;

interface Props extends DragCollectProps, DropCollectProps {
  cursor: TagCursor;
  onDrop: (p: { source: TagCursor; target: TagCursor }) => void;
}

class Dragify extends React.PureComponent<Props> {
  public render() {
    return (
      <Ref
        ref={instance => {
          const node = findDOMNode(instance);
          this.props.connectDragSource(node as any);
          this.props.connectDropTarget(node as any);
        }}
      >
        {this.props.children}
      </Ref>
    );
  }
}

export default DragSource('ELEMENT', dragSource, dragCollect)(
  DropTarget('ELEMENT', dropTarget, dropCollect)(Dragify),
);
