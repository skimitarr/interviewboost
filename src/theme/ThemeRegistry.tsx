"use client";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NextAppDirEmotionCacheProvider } from "./EmotionCache";

// Todo: add type and add mode later
// const customization: any = mode === 'dark' ? getDarkColors() : getLightColors();

declare module '@mui/material/styles' { //расширяем модуль для TS
  interface Theme {
    custom: {
      [key: string]: string;
    };
  }
}

const customization = {
  colorAzureBlue: '#557CFC', //сolorBtn
  colorSnowWhite: '#FFF', //colorWhite
  colorMidnightCoal: '#202123', //colorBlack1
  colorGraphiteGray: '#242526', //colorBlack2
  colorTwilightSlate: '#3C3E49', //colorBlack3
  colorShadowCharcoal: '#414350', //colorBlack4
  colorMainGradient: 'linear-gradient(180deg, #557CFC 0%, rgba(85, 124, 252, 0.09) 100%)',
  colorBackgroundGradient: 'linear-gradient(180deg, #3F4852 0%, #272A2D 100%)',
  colorCoralBlush: '#EB6C66', //сolorMark55
  colorAmberGlow: '#E9A469', //сolorMark65
  colorHoneydewGold: '#D3BE5D', //сolorMark75
  colorSapphireSky: '#1583EC', //сolorMark85
  colorJadeTeal: '#37A77B', //сolorMark100
};

const themeOptions = {
  custom: customization,
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
          color: '#fff',
        },
        a: {
          textDecoration: 'none',
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
