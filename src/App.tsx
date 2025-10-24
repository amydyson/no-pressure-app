import { BrowserRouter, useNavigate } from "react-router-dom";
import Home from "./components/common/Home";
import SignOut from "./components/common/SignOut";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Toolbar, Typography, Box, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import logo from "./assets/images/illustrations/logo-pumpkin.png";

// Navigation Bar component that can use useNavigate
function NavigationBar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="sticky" sx={{ 
      mb: 0,
      bgcolor: '#2F4F4F',
      color: '#FFFFFF'
    }}>
      <Toolbar sx={{ 
        flexDirection: { xs: 'column', sm: 'row' }, 
        gap: { xs: 1, sm: 0 },
        py: { xs: 1, sm: 0 }
      }}>
        <Box sx={{ 
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          gap: 0.5, // reduced gap for tighter alignment
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8
          }
        }}
        onClick={handleLogoClick}
        >
          <img 
            src={logo} 
            alt="No Pressure Logo" 
            style={{ 
              height: '48px', 
              width: 'auto',
              marginRight: 2 // extra tightness
            }} 
          />
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            lineHeight: 1,
            ml: 0 // remove any default margin
          }}>
            <Typography variant="body2" component="div" sx={{ 
              color: '#F4c430',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              mb: '-2px'
            }}>
              NO
            </Typography>
            <Typography variant="body2" component="div" sx={{ 
              color: '#F4c430',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              mt: '-2px'
            }}>
              PRESSURE
            </Typography>
          </Box>
        </Box>
        <Box>
          <SignOut />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box sx={{ 
          bgcolor: '#d7e9f7', 
          minHeight: '100vh',
          width: '100%',
          position: 'relative'
        }}>
          <CssBaseline />
          <NavigationBar />
          <Home />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
