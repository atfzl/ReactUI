import DragDrop from '#/common/api/DragDrop';
import GetPropsApi from '#/common/api/GetProps';
import { IJSXSource } from '#/common/types';
import { isInterinsicTag } from '#/common/utils';
import foobar from '#/components';
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

const Foo = () => {
  React.useEffect(() => {
    // tslint:disable-next-line:no-console
    GetPropsApi.answerMain(async f => {
      // tslint:disable-next-line:no-console
      console.log(f);

      throw new Error('909090');

      // return {
      //   times: 10,
      // };
    });

    // tslint:disable:no-console
    DragDrop.callMain({ _id: '12' })
      .then(console.log)
      .catch(console.error);
  });

  return <div>foo</div>;
};

ReactDOM.render(
  <div>
    <Foo />
    {isInterinsicTag('foo') ? 'True' : 'False'}
  </div>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
