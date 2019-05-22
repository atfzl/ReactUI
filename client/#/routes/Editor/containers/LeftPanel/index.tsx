import styled from '#/styled';
import * as React from 'react';

const Container = styled.div`
  background-color: ${props => props.theme.colors.background.dark};
  height: 200vh;
`;

class LeftPanel extends React.Component {
  public render() {
    return <Container>LeftPanel</Container>;
  }
}

export default LeftPanel;
