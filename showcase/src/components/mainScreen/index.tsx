import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 267px;
  width: 100%;
  background-image: linear-gradient(151deg, #3f28ac, #466af1);
  padding: 20px;
  padding-top: 46px;
`;

class MainScreen extends React.Component {
  public render() {
    return <Container />;
  }
}

export default MainScreen;
