import { BrowserRouter } from "react-router-dom";
import Home from "./components/common/Home";
import SignOut from "./components/common/SignOut";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import logo from "./assets/images/illustrations/logo-pumpkin.png";

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
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
            gap: 2
          }}>
            <img 
              src={logo} 
              alt="No Pressure Logo" 
              style={{ 
                height: '48px', 
                width: 'auto'
              }} 
            />
            <Typography variant="h6" component="div">
              No Pressure
            </Typography>
          </Box>
          <Box>
            <SignOut />
          </Box>
        </Toolbar>
      </AppBar>
      <Home />
    </BrowserRouter>
  );
}

export default App;
