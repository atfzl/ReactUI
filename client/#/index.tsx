import '#/aaa-devToolsHook';
import Routes from '#/routes';
import store from '#/store';
import globalCss from '#/styled/global';
import { theme } from '#/styled/theme';
import { Global } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Global styles={globalCss} />
    <Provider store={store}>
      <Router>
        <Routes />
      </Router>
    </Provider>
  </ThemeProvider>,
  document.getElementById('app'),
);
