import Isolate from '#/components/Isolate';
import { RootState } from '#/reducers';
import actions from '#/reducers/gallery/actions';
import styled from '#/styled';
import * as React from 'react';
import { connect } from 'react-redux';

const Container = styled.div`
  background-color: oldlace;
`;

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

interface Props extends StateProps, DispatchProps {}

class RightPanel extends React.PureComponent<Props> {
  public render() {
    return (
      <Container>
        <Isolate onReady={this.props.setCanvasInternals}>
          {this.props.workspace &&
            this.props.workspace.components[0].instances[0].element}
        </Isolate>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  workspace: state.gallery.workspace,
});

const mapDispatchToProps = {
  setCanvasInternals: actions.setCanvasInternals,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RightPanel);
