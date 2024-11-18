// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0D92F4', // Primary blue
            light: '#64b5f6', // Light blue
            dark: '#1976d2', // Dark blue
            contrastText: '#ffffff', // White text
        },
        secondary: {
            main: '#FFF100', // Gold/yellow
            contrastText: '#000000', // Black text
        },
        background: {
            default: '#e3f2fd', // Light blue background
            paper: '#ffffff', // White background for paper components
        },
        text: {
            primary: '#0d47a1', // Dark blue text
            secondary: '#ffffff', // White text
        },
    },
    typography: {
        fontFamily: '"Roboto", sans-serif',
        h4: {
            fontWeight: 700,
        },
        button: {
            textTransform: 'none',
        },
    },
});

export default theme;
