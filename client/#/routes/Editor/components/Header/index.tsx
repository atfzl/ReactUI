import ComponentInstanceName from '#/routes/Editor/containers/ComponentInstanceName';
import ProgressIndicator from '#/routes/Editor/containers/ProgressIndicator';
import ZoomPanelContainer from '#/routes/Editor/containers/ZoomPanelContainer';
import styled from '#/styled';
import * as React from 'react';

const Container = styled.div`
  background-color: ${props => props.theme.colors.header};
  border-bottom: 1px solid ${props => props.theme.colors.border[50]};
  flex: 0 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
`;

const Header = () => (
  <Container>
    <ComponentInstanceName />
    <ProgressIndicator />
    <ZoomPanelContainer />
  </Container>
);

export default Header;
