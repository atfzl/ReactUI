import Isolate from '#/routes/Editor/components/Isolate';
import * as React from 'react';

class Editor extends React.Component {
  public render() {
    return (
      <div style={{ border: '1px solid black', display: 'inline-block' }}>
        <Isolate />
      </div>
    );
  }
}

export default Editor;
