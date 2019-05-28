import Dragify from '#/components/Dragify';
import Overlay from '#/components/Overlay';
import { RootState } from '#/reducers';
import actions from '#/reducers/editor/actions';
import * as React from 'react';
import { connect } from 'react-redux';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

interface Props extends StateProps, DispatchProps {}

class OverlayLayer extends React.Component<Props> {
  public render() {
    const {
      nodeMap,
      selectedOverlay,
      hoveredOverlay,
      setSelectedOverlay,
      setHoveredOverlay,
      launchEditorForCursor,
      handleDrop,
    } = this.props;

    return Object.keys(nodeMap).map(id => {
      const { nativeNode, fiberNode } = nodeMap[id];

      const { _debugSource: source } = fiberNode;

      if (!nativeNode || !source) {
        return null;
      }

      return (
        <Dragify key={id} cursor={source} onDrop={handleDrop}>
          <Overlay
            id={id}
            selected={selectedOverlay === id}
            hovered={hoveredOverlay === id}
            onClick={setSelectedOverlay}
            onDoubleClick={() => launchEditorForCursor(fiberNode._debugSource!)}
            onHover={setHoveredOverlay}
          >
            {nativeNode}
          </Overlay>
        </Dragify>
      );
    });
  }
}

const mapStateToProps = (state: RootState) => ({
  nodeMap: state.editor.nodeMap,
  selectedOverlay: state.editor.overlay.selected,
  hoveredOverlay: state.editor.overlay.hovered,
});

const mapDispatchToProps = {
  setSelectedOverlay: (id: string | undefined) => {
    if (id === undefined) {
      return actions.setSelectedOverlay(undefined);
    }

    return actions.setSelectedOverlay({ id, source: 'canvas' });
  },
  setHoveredOverlay: (id: string | undefined) => {
    if (id === undefined) {
      return actions.setHoveredOverlay(undefined);
    }
    return actions.setHoveredOverlay({ id, source: 'canvas' });
  },
  launchEditorForCursor: actions.launchEditorForCursor,
  handleDrop: actions.handleDrop,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverlayLayer);
