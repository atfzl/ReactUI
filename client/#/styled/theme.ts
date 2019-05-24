export const theme = (() => {
  const palette = {
    blue: {
      main: 'blue',
    },
    pink: {
      main: '#f400b5',
    },
  };

  return {
    colors: {
      palette,
      primary: palette.blue.main,
      accent: palette.pink.main,
      border: {
        main: 'rgba(0, 0, 0, 0.5)',
      },
      background: {
        main: '#f9f9f9',
        dark: '#f2f2f2',
      },
    },
  };
})();

export type Theme = typeof theme;
