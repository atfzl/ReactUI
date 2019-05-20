import Routes from '#/routes';
import store from '#/store';
import globalCss from '#/styles/global';
import { Global } from '@emotion/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <Provider store={store}>
    <Global styles={globalCss} />
    <Router>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
