import Isolate from '#/components/Isolate';
import styled from '@emotion/styled';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 32px;
`;

const Wrapper = styled.div`
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
  display: inline-block;
  overflow: hidden;
`;

class Canvas extends React.Component {
  private onIsolateReady(document: Document, element: Element) {
    document.addEventListener('icarus-build', (e: any) => {
      const { detail } = e;

      ReactDOM.render(<>{detail.workspace[0].instances[0]}</>, element);
    });

    const script = document.createElement('script');
    script.src = 'http://localhost:9889/app.js';
    document.body.appendChild(script);
  }

  public render() {
    return (
      <Container>
        <Wrapper>
          <Isolate onReady={this.onIsolateReady} />
        </Wrapper>
      </Container>
    );
  }
}

export default Canvas;
