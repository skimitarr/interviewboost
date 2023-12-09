import { Theme as MuiTheme } from '@mui/material/styles';

interface CustomProperties {
    [key: string]: string;
}

declare module '@mui/material/styles' {
    interface Theme extends MuiTheme {
        custom: CustomProperties;
    }
}
