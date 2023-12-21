"use client";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";
import { THEME_CUSTOMIZATION } from "@/theme/ThemeCustomizations";

// Todo: add type and de later
// const customization: any = mode === 'dark' ? getDarkColors() : getLightColors();

const themeOptions = {
  custom: THEME_CUSTOMIZATION,
  typography: {
    fontSize: 14,
    fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    background: {
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
            src: `url('/fonts/Lato-Regular.woff2') format('woff2')`,
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontDisplay: 'swap',
          },
          {
            fontFamily: 'Lato',
            src: `url('/fonts/Lato-Semibold.woff2') format('woff2')`,
            fontStyle: 'normal',
            fontWeight: 600,
            fontDisplay: 'swap',
          },
        ],
        '*': {
          textTransform: 'none',
          color: '#fff',
        },
        a: {
          textDecoration: 'none',
        },
        p: {
          margin: '0',
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
