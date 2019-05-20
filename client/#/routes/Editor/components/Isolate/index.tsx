import * as React from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';

interface State {
  data?: any;
}

class Isolate extends React.Component<{}, State> {
  public state: State = {};

  private window?: Window;
  private document?: Document;

  private frameLoaded(window: Window, document: Document) {
    this.window = window;
    this.document = document;

    document.addEventListener('icarus-build', (e: any) => {
      this.setState({ data: e.detail });
    });

    const script = document.createElement('script');
    script.src = 'http://localhost:9889/app.js';
    this.document.body.appendChild(script);
    this.document.body.style.margin = '0';
  }

  public render() {
    return (
      <Frame
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
          display: 'block',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 32,
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
                    this.frameLoaded(window, document);
                  }}
                </FrameContextConsumer>
              );
            }

            if (this.state.data) {
              return (
                <div
                  style={{
                    display: 'inline-block',
                    boxShadow: '0px 0px 2px 1px rgba(0,0,0,0.2)',
                  }}
                >
                  {this.state.data.workspace[0].instances[0]}
                </div>
              );
            }

            return null;
          })()}
        </div>
      </Frame>
    );
  }
}

export default Isolate;
