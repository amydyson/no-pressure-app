import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#BE550F', // Set new orange-brown color as primary
      dark: '#9A4608', // Darker shade for hover states
      light: '#D4681A', // Lighter shade if needed
      contrastText: '#FFFFFF', // White text on orange-brown background
    },
    secondary: {
      main: '#BE550F', // Set new orange-brown color as secondary
      dark: '#9A4608', // Darker shade for hover states
      light: '#D4681A', // Lighter shade if needed
      contrastText: '#FFFFFF', // White text on orange-brown background
    },
    background: {
      default: '#d7e9f7', // Set app background color
      paper: '#d7e9f7', // Set paper component background
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)', // Keep default primary text color
      secondary: '#BE550F', // Set new orange-brown color as secondary text color
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // Remove all Paper shadows
        },
      },
    },
  },
});