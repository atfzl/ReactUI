import { RootState } from '#/reducers';
import styled from '#/styled';
import * as React from 'react';
import { connect } from 'react-redux';

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-left: 2px;
`;

const ComponentName = styled.div`
  font-weight: 600;
  margin-right: 4px;
`;

const InstanceName = styled.div`
  margin-left: 4px;
`;

type StateProps = ReturnType<typeof mapStateToProps>;

interface Props extends StateProps {}

const ComponentInstanceName: React.SFC<Props> = props => {
  if (!props.workspace) {
    return null;
  }

  const component = props.workspace.components[props.selectedComponent[0]];
  const componentName = component.title;
  const instanceName = component.instances[props.selectedComponent[1]].title;

  return (
    <Container>
      <ComponentName>{componentName}</ComponentName>
      <div>/</div>
      <InstanceName>{instanceName}</InstanceName>
    </Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedComponent: state.gallery.selectedComponent,
  workspace: state.gallery.workspace,
});

export default connect(mapStateToProps)(ComponentInstanceName);
