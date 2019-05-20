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
  display: flex;
  overflow: hidden;
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

const CenterHeader = styled.div`
  background-color: orchid;
  flex: 0 0 32px;
`;

const CenterBodyWrapper = styled.div`
  overflow: auto;
  padding: 32px;
  text-align: center;
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
          <LeftBodyWrapper>
            <LeftBody>Left</LeftBody>
          </LeftBodyWrapper>
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
