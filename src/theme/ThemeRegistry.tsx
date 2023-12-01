"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";

const themeOptions: ThemeOptions = {
  typography: {
    fontSize: 14,
    fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    background: {
      // pink
      default: "#f8bbd0",
    },
    primary: {
      main: "#1976d2",
    },
    text: {
      primary: "#300000",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': [
          {
            fontFamily: 'Lato',
            src: `url('../../public/fonts/Lato-Regular.woff2') format('woff2')`,
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontDisplay: 'swap',
          },
          {
            fontFamily: 'Lato',
            src: `url('../../public/fonts/Lato-Semibold.woff2') format('woff2')`,
            fontStyle: 'normal',
            fontWeight: 600,
            fontDisplay: 'swap',
          },
        ],
        '*': {
          textTransform: 'none',
          color: '#fff', // белый цвет текста для всех элементов
          // fontSize: '14px', // размер шрифта 14px для всех элементов
        },
        a: {
          textDecoration: 'none',
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
