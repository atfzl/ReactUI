import { TagCursor } from '#/common/models/file';
import Ref from '#/components/Ref';
import * as React from 'react';
import {
  DragSource,
  DragSourceConnector,
  DropTarget,
  DropTargetConnector,
} from 'react-dnd';
import { findDOMNode } from 'react-dom';

const dragSource = {
  beginDrag(props: Props) {
    props.onDrag(props.cursor);
    return {};
  },
};

const dragCollect = (connect: DragSourceConnector) => ({
  connectDragSource: connect.dragSource(),
});

const dropTarget = {
  drop(props: Props) {
    props.onDrop(props.cursor);
  },
};

const dropCollect = (connect: DropTargetConnector) => ({
  connectDropTarget: connect.dropTarget(),
});

type DragCollectProps = ReturnType<typeof dragCollect>;
type DropCollectProps = ReturnType<typeof dropCollect>;

interface Props extends DragCollectProps, DropCollectProps {
  cursor: TagCursor;
  onDrag: (cursor?: TagCursor) => void;
  onDrop: (cursor?: TagCursor) => void;
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
