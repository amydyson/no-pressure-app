import React from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Home from "./components/common/Home";
import SignOut from "./components/common/SignOut";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Toolbar, Typography, Box, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import logo from "./assets/images/illustrations/logo-pumpkin.png";

// Navigation Bar component that can use useNavigate
// Create a context for language
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};
export const LanguageContext = React.createContext<LanguageContextType>({ language: 'en', setLanguage: () => {} });

function NavigationBar({ language, setLanguage }: { language: string, setLanguage: (lang: string) => void }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  // Header text translations
  const headerText = language === 'pt' ? { top: 'SEM', bottom: 'PRESSÃO' } : { top: 'NO', bottom: 'PRESSURE' };

  return (
    <AppBar position="sticky" sx={{ mb: 0, bgcolor: '#2F4F4F', color: '#FFFFFF' }}>
      {/* Responsive Toolbar: one row on desktop, two rows on mobile */}
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: { xs: 56, md: 64 },
          px: 1,
          py: { xs: 0.5, md: 0 },
        }}
      >
        {/* Left: Logo and Title */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            gap: 1,
          }}
          onClick={handleLogoClick}
        >
          <img
            src={logo}
            alt="No Pressure Logo"
            style={{ height: '40px', width: 'auto', marginRight: 6 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1, ml: 0 }}>
            <Typography variant="body2" component="div" sx={{ color: '#F4c430', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', mb: '-2px' }}>
              {headerText.top}
            </Typography>
            <Typography variant="body2" component="div" sx={{ color: '#F4c430', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', mt: '-2px' }}>
              {headerText.bottom}
            </Typography>
          </Box>
        </Box>
        {/* Right: Desktop - Language dropdown left of Sign Out; Mobile - only Sign Out */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 'auto', md: 2 }, gap: 2 }}>
          {/* Desktop: Language dropdown */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={{
                background: '#fff',
                color: '#2F4F4F',
                borderRadius: 4,
                border: '1px solid #BE550F',
                padding: '4px 12px',
                fontWeight: 'bold',
                fontSize: '1rem',
                outline: 'none',
                cursor: 'pointer',
                minWidth: 90,
              }}
              aria-label="Language Switcher"
            >
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </Box>
          <Box>
            <SignOut />
          </Box>
        </Box>
      </Toolbar>
      {/* Second Row: Language Switcher right (mobile only) */}
      <Toolbar
        sx={{
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          minHeight: 36,
          bgcolor: '#2F4F4F',
          px: 1,
          pb: { xs: 2, md: 0 }, // Add padding below on mobile
        }}
      >
        <Box>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              background: '#fff',
              color: '#2F4F4F',
              borderRadius: 4,
              border: '1px solid #BE550F',
              padding: '4px 12px',
              fontWeight: 'bold',
              fontSize: '1rem',
              outline: 'none',
              cursor: 'pointer',
              minWidth: 90,
            }}
            aria-label="Language Switcher"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [language, setLanguage] = React.useState('pt');
  return (
    <ThemeProvider theme={theme}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <BrowserRouter>
          <Box sx={{ 
            bgcolor: '#d7e9f7', 
            minHeight: '100vh',
            width: '100%',
            position: 'relative'
          }}>
            <CssBaseline />
            <NavigationBar language={language} setLanguage={setLanguage} />
            <Home />
          </Box>
        </BrowserRouter>
      </LanguageContext.Provider>
    </ThemeProvider>
  );
}

export default App;
