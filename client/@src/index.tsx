import { IJSXSource } from '@src/common/interfaces';
import { isInterinsicTag } from '@src/common/utils';
import foobar from '@src/components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

foobar();

const a: IJSXSource = {
  fileName: '',
  lineNumber: 1,
  columnNumber: 1,
};

// tslint:disable-next-line:no-console
console.log(a);

ReactDOM.render(
  <div>Hello Wrld: {isInterinsicTag('foo') ? 'True' : 'False'}</div>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
