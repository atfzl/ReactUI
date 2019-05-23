import Isolate from '#/components/Isolate';
import { RootState } from '#/reducers';
import actions from '#/reducers/editor/actions';
import styled from '#/styled';
import * as React from 'react';
import { connect } from 'react-redux';
import OverlayLayer from '../OverlayLayer';

const Wrapper = styled.div`
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
  display: inline-block;
`;

type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;

interface Props extends DispatchProps, StateProps {}

class Canvas extends React.PureComponent<Props> {
  public render() {
    const { zoomLevel, setCanvasDomInternals } = this.props;

    return (
      <Wrapper style={{ transform: `scale(${zoomLevel})` }}>
        <Isolate onReady={setCanvasDomInternals} />
        <OverlayLayer />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  zoomLevel: state.editor.zoomLevel,
});

const mapDispatchToProps = {
  setCanvasDomInternals: actions.setCanvasDomInternals,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canvas);
