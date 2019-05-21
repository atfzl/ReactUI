import * as React from 'react';
import { injectGlobal } from 'styled-components';
import AlbumArt from './components/AlbumArt';
import Page from './components/Page';
import Seeker from './components/Seeker';

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
    title: 'Page',
    instances: [
      {
        element: <Page />,
      },
    ],
  },
  {
    title: 'Album Art',
    instances: [
      {
        element: (
          <div style={{ width: 200, height: 200 }}>
            <AlbumArt src="https://upload.wikimedia.org/wikipedia/en/6/6e/Opus_Eric_Prydz_cover_artwork.jpg" />
          </div>
        ),
      },
      {
        element: (
          <div style={{ width: 200, height: 200 }}>
            <AlbumArt src="https://media.pitchfork.com/photos/5a95784ab848c0268b200ffd/1:1/w_320/2012%20-%202017.jpg" />
          </div>
        ),
      },
    ],
  },
  {
    title: 'Seeker',
    instances: [
      {
        element: <Seeker currentTime={108} endTime={671} />,
      },
    ],
  },
];

const event = new CustomEvent('beragi', {
  detail: {
    components,
  },
});

document.dispatchEvent(event);
