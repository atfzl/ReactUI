import styled from 'styled-components'
import * as React from 'react';
import { injectGlobal } from 'styled-components';
import MainScreen from './components/mainScreen';const Div_$ = styled.div`
                 height: 200px;
                 width: 200px;
                 background-color: lightgrey;
                 border: 1px solid black;
             `;
              


// tslint:disable-next-line no-unused-expression
injectGlobal`
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css?family=Roboto:400,600,700');

body {
  font-family: 'Roboto', sans-serif;
}

* {
  box-sizing: border-box;
}
`;

export const components = [
  {
    title: 'Main Screen',
    instances: [
      {
        title: 'default',
        element: (
          <div style={{ width: 375 }}>
            <MainScreen />
          </div>
        ),
      },
    ],
  },
];

const event = new CustomEvent('reactui', {
  detail: {
    components,
  },
});

document.dispatchEvent(event);
