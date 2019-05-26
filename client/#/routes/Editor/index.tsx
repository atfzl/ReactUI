import LaunchEditorApi from '#/common/api/LaunchEditor';
import Header from '#/routes/Editor/components/Header';
import Canvas from '#/routes/Editor/containers/Canvas';
import RightPanel from '#/routes/Editor/containers/RightPanel';
import styled from '#/styled';
import * as React from 'react';
import LeftPanel from './containers/LeftPanel';

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

const Center = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  background-color: ${props => props.theme.colors.background.main};
`;

const Right = styled.div`
  flex: 0 0 240px;
  display: flex;
  overflow: hidden;
  height: 100vh;
  border-left: 1px solid ${props => props.theme.colors.border.main};
`;

const RightBodyWrapper = styled.div`
  overflow-y: auto;
  flex: 1;
`;

class Editor extends React.Component {
  public componentDidMount() {
    LaunchEditorApi.callMain({
      fileName:
        '/Users/I0459/scratch/personal/ellipsoid/showcase/src/components/Page/index.tsx',
      lineNumber: 143,
      columnNumber: 13,
    });
  }

  public render() {
    return (
      <Container>
        <Left>
          <LeftBodyWrapper>
            <LeftPanel />
          </LeftBodyWrapper>
        </Left>
        <Center>
          <Header />
          <Canvas />
        </Center>
        <Right>
          <RightBodyWrapper>
            <RightPanel />
          </RightBodyWrapper>
        </Right>
      </Container>
    );
  }
}

export default Editor;
