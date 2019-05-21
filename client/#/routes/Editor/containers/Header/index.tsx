import styled from '#/styled';
import * as React from 'react';

const Container = styled.div`
  background-color: #fdf9f3;
  border-bottom: 1px solid ${props => props.theme.colors.border.main};
  flex: 0 0 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 6px;
`;

const Header = () => (
  <Container>
    <i className="material-icons">zoom_in</i>
    <i className="material-icons">zoom_out</i>
  </Container>
);

export default Header;
