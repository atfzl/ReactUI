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
    } = this.props;

    return Object.keys(nodeMap).map(id => {
      const { nativeNode, fiberNode } = nodeMap[id];

      if (!nativeNode || !fiberNode._debugSource) {
        return null;
      }

      return (
        <Overlay
          key={id}
          id={id}
          selected={selectedOverlay === id}
          hovered={hoveredOverlay === id}
          onClick={setSelectedOverlay}
          onHover={setHoveredOverlay}
        >
          {nativeNode}
        </Overlay>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverlayLayer);
