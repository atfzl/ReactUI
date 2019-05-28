import Dragify from '#/components/Dragify';
import { RootState } from '#/reducers';
import actions from '#/reducers/editor/actions';
import TreeRow from '#/routes/Editor/components/TreeRow';
import styled from '#/styled';
import * as React from 'react';
import { connect } from 'react-redux';

const Container = styled.div`
  background-color: ${props => props.theme.colors.background[100]};
  display: flex;
  flex-direction: column;
  padding: 12px 18px;
`;

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

interface Props extends StateProps, DispatchProps {}

class LeftPanel extends React.Component<Props> {
  public render() {
    const {
      nodeMap,
      selectedOverlay,
      hoveredOverlay,
      setSelectedOverlay,
      setHoveredOverlay,
      hoverOverlaySource,
      handleDrop,
    } = this.props;

    return (
      <Container>
        {Object.keys(nodeMap).map(id => {
          const { fiberNode, depth } = nodeMap[id];

          const { _debugSource: source } = fiberNode;

          if (!source) {
            return null;
          }

          return (
            <Dragify key={id} cursor={source} onDrop={handleDrop}>
              <TreeRow
                selected={id === selectedOverlay}
                hovered={id === hoveredOverlay}
                depth={depth}
                id={id}
                onClick={setSelectedOverlay}
                onHover={setHoveredOverlay}
                scrollIntoViewOnHover={hoverOverlaySource === 'canvas'}
              >
                {source.tagName}
              </TreeRow>
            </Dragify>
          );
        })}
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  nodeMap: state.editor.nodeMap,
  selectedOverlay: state.editor.overlay.selected,
  hoveredOverlay: state.editor.overlay.hovered,
  hoverOverlaySource: state.editor.overlay.hoverSource,
});

const mapDispatchToProps = {
  setSelectedOverlay: (id: string | undefined) => {
    if (id === undefined) {
      return actions.setSelectedOverlay(undefined);
    }
    return actions.setSelectedOverlay({ id, source: 'tree' });
  },
  setHoveredOverlay: (id: string | undefined) => {
    if (id === undefined) {
      return actions.setHoveredOverlay(undefined);
    }
    return actions.setHoveredOverlay({ id, source: 'tree' });
  },
  handleDrop: actions.handleDrop,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeftPanel);
