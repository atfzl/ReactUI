import * as palette from '@carbon/colors';

export const theme = {
  palette,
  colors: {
    palette,
    primary: palette.blue[60],
    accent: palette.magenta[50],
    border: {
      50: palette.rgba(palette.black, 0.5),
    },
    background: {
      50: palette.gray[10],
      100: palette.rgba(palette.gray[20], 0.7),
    },
    header: palette.warmGray[10],
  },
};

export type Theme = typeof theme;
