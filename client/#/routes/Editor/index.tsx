import Canvas from '#/routes/Editor/containers/Canvas';
import Header from '#/routes/Editor/containers/Header';
import styled from '#/styled';
import * as React from 'react';

const Container = styled.div`
  min-width: 1024px;
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const Left = styled.div`
  flex: 0 0 240px;
  display: flex;
  overflow: hidden;
  border-right: 1px solid ${props => props.theme.colors.border.main};
`;

const LeftBodyWrapper = styled.div`
  overflow: auto;
  flex: 1;
`;

const LeftBody = styled.div`
  background-color: oldlace;
  height: 200vh;
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  background-color: #f9f9f9;
`;

const CenterBodyWrapper = styled.div`
  overflow: auto;
  padding: 32px;
  text-align: center;
`;

const Right = styled.div`
  flex: 0 0 240px;
  display: flex;
  overflow: hidden;
  border-left: 1px solid ${props => props.theme.colors.border.main};
`;

const RightBodyWrapper = styled.div`
  overflow: auto;
  flex: 1;
`;

const RightBody = styled.div`
  background-color: oldlace;
  height: 200vh;
`;

class Editor extends React.Component {
  public render() {
    return (
      <Container>
        <Left>
          <LeftBodyWrapper>
            <LeftBody>Left</LeftBody>
          </LeftBodyWrapper>
        </Left>
        <Center>
          <Header />
          <CenterBodyWrapper>
            <Canvas />
          </CenterBodyWrapper>
        </Center>
        <Right>
          <RightBodyWrapper>
            <RightBody>Right</RightBody>
          </RightBodyWrapper>
        </Right>
      </Container>
    );
  }
}

export default Editor;
