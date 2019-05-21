import { RootState } from '#/reducers';
import styled from '#/styled';
import * as React from 'react';
import { connect } from 'react-redux';

const Container = styled.div`
  background-color: oldlace;
  height: 200vh;
`;

type StateProps = ReturnType<typeof mapStateToProps>;

interface Props extends StateProps {}

class RightPanel extends React.PureComponent<Props> {
  public render() {
    if (!this.props.workspace) {
      return null;
    }

    return this.props.workspace.components.map(component => (
      <Container>
        {component.title}
        <div>
          {component.instances.map(instance => (
            <div>
              <div>{instance.title}</div>
              />
            </div>
          ))}
        </div>
      </Container>
    ));
  }
}

const mapStateToProps = (state: RootState) => ({
  workspace: state.editor.workspace,
});

export default connect(mapStateToProps)(RightPanel);
