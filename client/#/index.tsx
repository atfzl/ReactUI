import * as React from 'react';
import * as ReactDOM from 'react-dom';

ReactDOM.render(<div>foo</div>, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}
