import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';

interface State {
  refRect?: ClientRect;
}

class Isolate extends React.Component<{}, State> {
  public state: State = {};

  private ref?: HTMLDivElement | null;
  private window?: Window;
  private document?: Document;

  private setRef = (ref: HTMLDivElement | null) => {
    if (!ref) {
      return;
    }

    this.ref = ref;

    const resizeObserver = new (window as any).ResizeObserver(
      (entries: any) => {
        for (const entry of entries) {
          this.setState({ refRect: entry.contentRect });
        }
      },
    );

    resizeObserver.observe(ref);
  };

  private onFrameLoad(window: Window, document: Document) {
    this.window = window;
    this.document = document;

    document.addEventListener('icarus-build', (e: any) => {
      const { detail } = e;

      ReactDOM.render(<>{detail.workspace[0].instances[0]}</>, this.ref!);
    });

    const script = document.createElement('script');
    script.src = 'http://localhost:9889/app.js';
    this.document.body.appendChild(script);
    this.document.body.style.margin = '0';
  }

  public render() {
    const { refRect } = this.state;

    return (
      <Frame
        style={{
          width: refRect ? refRect.width : '100%',
          height: refRect ? refRect.height : '100%',
          border: 'none',
          display: 'block',
        }}
      >
        {(() => {
          if (!this.window) {
            return (
              <FrameContextConsumer>
                {({
                  window,
                  document,
                }: {
                  window: Window;
                  document: Document;
                }) => {
                  this.onFrameLoad(window, document);
                }}
              </FrameContextConsumer>
            );
          }

          return null;
        })()}
        <div style={{ display: 'inline-block' }} ref={this.setRef} />
      </Frame>
    );
  }
}

export default Isolate;
