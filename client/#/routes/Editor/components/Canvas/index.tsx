import Isolate from '#/components/Isolate';
import { executeScript } from '#/utils';
import styled from '@emotion/styled';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const Wrapper = styled.div`
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
  display: inline-block;
`;

class Canvas extends React.Component {
  private onIsolateReady(doc: Document, element: Element) {
    doc.addEventListener('icarus-build', (e: any) => {
      const { detail } = e;

      ReactDOM.render(<>{detail.workspace[0].instances[0]}</>, element);
    });

    // tslint:disable-next-line:no-console
    document.addEventListener('beragi-commit-fiber-root', console.log);

    executeScript('http://localhost:9889/app.js', doc);
  }

  public render() {
    return (
      <Wrapper>
        <Isolate onReady={this.onIsolateReady} />
      </Wrapper>
    );
  }
}

export default Canvas;
