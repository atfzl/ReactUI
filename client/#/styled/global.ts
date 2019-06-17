import { css } from '@emotion/core';
import fontCss from './fonts';

const globalCss = css`
  ${fontCss}

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'IBM Plex Sans', sans-serif;
  }
`;

export default globalCss;
