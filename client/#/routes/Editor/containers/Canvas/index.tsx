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
    return (
      <Wrapper style={{ transform: `scale(${this.props.zoomLevel})` }}>
        <Isolate onReady={this.props.setCanvasInternals}>
          {this.props.workspace &&
            this.props.workspace.components[0].instances[0].element}
        </Isolate>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  zoomLevel: state.editor.zoomLevel,
  workspace: state.editor.workspace,
});

const mapDispatchToProps = {
  setCanvasInternals: actions.setCanvasInternals,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Canvas);
