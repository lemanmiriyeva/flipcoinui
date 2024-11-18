import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3', // Primary blue
            light: '#64b5f6', // Light blue
            dark: '#1976d2', // Dark blue
            contrastText: '#ffffff', // White text
        },
        secondary: {
            main: '#FFC107', // Gold/yellow
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


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <App/>
        </ThemeProvider>
    </StrictMode>
);
