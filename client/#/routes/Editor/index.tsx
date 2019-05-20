import Canvas from '#/routes/Editor/components/Canvas';
import styled from '@emotion/styled';
import * as React from 'react';

const Container = styled.div`
  min-width: 1024px;
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const Left = styled.div`
  flex: 0 0 240px;
  background-color: oldlace;
  display: flex;
  overflow: hidden;
`;

const LeftBodyWrapper = styled.div`
  overflow: auto;
`;

const LeftBody = styled.div`
  padding: 2px;
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  background-color: #f9f9f9;
`;

const CenterHeader = styled.div`
  background-color: orchid;
  flex: 0 0 32px;
`;

const CenterBodyWrapper = styled.div`
  overflow: auto;
`;

const Right = styled.div`
  background-color: midnightblue;
  flex: 0 0 240px;
  display: flex;
  overflow: hidden;
`;

const RightBodyWrapper = styled.div`
  overflow: auto;
  flex: 1;
`;

const RightBody = styled.div`
  background-color: coral;
  height: 200vh;
`;

class Editor extends React.Component {
  public render() {
    return (
      <Container>
        <Left>
          <LeftBody>
            <LeftBodyWrapper>Left</LeftBodyWrapper>
          </LeftBody>
        </Left>
        <Center>
          <CenterHeader>Header</CenterHeader>
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
