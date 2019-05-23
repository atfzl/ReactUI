import Isolate from '#/components/Isolate';
import { RootState } from '#/reducers';
import actions from '#/reducers/editor/actions';
import styled from '#/styled';
import * as React from 'react';
import { connect } from 'react-redux';

const Wrapper = styled.div`
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
  display: inline-block;
`;

type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;

interface Props extends DispatchProps, StateProps {}

class Canvas extends React.PureComponent<Props> {
  public render() {
    const {
      zoomLevel,
      setCanvasDomInternals,
      workspace,
      selectedComponent,
    } = this.props;

    const selectedElement =
      workspace &&
      workspace.components[selectedComponent[0]].instances[selectedComponent[1]]
        .element;

    return (
      <Wrapper style={{ transform: `scale(${zoomLevel})` }}>
        <Isolate onReady={setCanvasDomInternals}>{selectedElement}</Isolate>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  zoomLevel: state.editor.zoomLevel,
  workspace: state.editor.workspace,
  selectedComponent: state.gallery.selectedComponent,
});

const mapDispatchToProps = {
  setCanvasDomInternals: actions.setCanvasDomInternals,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canvas);
