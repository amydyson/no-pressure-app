import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#A0522D', // Set rust color as primary
      dark: '#8B4513', // Darker shade for hover states
      light: '#CD853F', // Lighter shade if needed
      contrastText: '#FFFFFF', // White text on rust background
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)', // Keep default primary text color
      secondary: '#A0522D', // Set rust color as secondary text color
    },
  },
});