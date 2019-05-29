import Isolate from '#/components/Isolate';
import { RootState } from '#/reducers';
import actions from '#/reducers/editor/actions';
import OverlayLayer from '#/routes/Editor/containers/OverlayLayer';
import styled from '#/styled';
import * as React from 'react';
import { connect } from 'react-redux';

const Container = styled.div`
  overflow: auto;
  padding: 32px;
  text-align: center;
  position: relative;
`;

const Wrapper = styled.div`
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
  display: inline-block;
  user-select: none;
`;

type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;

interface Props extends DispatchProps, StateProps {}

class Canvas extends React.PureComponent<Props> {
  private onContainerClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) {
      this.props.deselectOverlay();
    }
  };

  public render() {
    const { zoomLevel, setCanvasDomInternals } = this.props;

    return (
      <Container onClick={this.onContainerClick}>
        <Wrapper style={{ transform: `scale(${zoomLevel})` }}>
          <Isolate onReady={setCanvasDomInternals} />
          <OverlayLayer />
        </Wrapper>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  zoomLevel: state.editor.zoomLevel,
});

const mapDispatchToProps = {
  setCanvasDomInternals: actions.setCanvasDomInternals,
  deselectOverlay: () => actions.setSelectedOverlay(undefined),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canvas);
