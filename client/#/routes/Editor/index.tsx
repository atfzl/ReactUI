import Isolate from '#/routes/Editor/components/Isolate';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Editor extends React.Component {
  public render() {
    return (
      <div style={{ border: '1px solid black', display: 'inline-block' }}>
        <Isolate
          onReady={(document, element) => {
            document.addEventListener('icarus-build', (e: any) => {
              const { detail } = e;

              ReactDOM.render(<>{detail.workspace[0].instances[0]}</>, element);
            });

            const script = document.createElement('script');
            script.src = 'http://localhost:9889/app.js';
            document.body.appendChild(script);
          }}
        />
      </div>
    );
  }
}

export default Editor;
