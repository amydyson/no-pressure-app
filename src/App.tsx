import React from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Home from "./components/common/Home";
import SignOut from "./components/common/SignOut";
import bookIcon from "./assets/images/avatar-icons/book.png";
import catIcon from "./assets/images/avatar-icons/cat.png";
import dogIcon from "./assets/images/avatar-icons/dog.png";
import flowerIcon from "./assets/images/avatar-icons/flower.png";
import guitarIcon from "./assets/images/avatar-icons/guitar.png";
import headphonesIcon from "./assets/images/avatar-icons/headphones.png";
import moonIcon from "./assets/images/avatar-icons/moon.png";
import sunIcon from "./assets/images/avatar-icons/sun.png";
import umbrellaIcon from "./assets/images/avatar-icons/umbrella.png";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Toolbar, Typography, Box, ThemeProvider, Button } from "@mui/material";
import { theme } from "./theme";
import logo from "./assets/images/illustrations/logo-pumpkin.png";
import LanguageContext from "./LanguageContext";

function NavigationBar({ language, setLanguage, avatar }: { language: string, setLanguage: (lang: string) => void, avatar?: string | null }) {
  const navigate = useNavigate();

  // Explore dropdown no longer uses anchor/menu logic

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
        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 'auto', md: 2 }, gap: 2 }}>
          <Button
            id="explore-button"
            onClick={() => navigate('/patient/blood-pressure')}
            sx={{ color: '#fff', fontWeight: 600, ml: 2 }}
          >
            Explore
          </Button>
          {/* Language Selector always visible in header */}
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
          <Box>
            <SignOut />
          </Box>
          {avatar && (
            <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
              <img
                src={
                  avatar === 'book' ? bookIcon :
                  avatar === 'cat' ? catIcon :
                  avatar === 'dog' ? dogIcon :
                  avatar === 'flower' ? flowerIcon :
                  avatar === 'guitar' ? guitarIcon :
                  avatar === 'headphones' ? headphonesIcon :
                  avatar === 'moon' ? moonIcon :
                  avatar === 'sun' ? sunIcon :
                  avatar === 'umbrella' ? umbrellaIcon :
                  undefined
                }
                alt={avatar}
                style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: '50%', background: '#fff', border: '2px solid #BE550F' }}
              />
            </Box>
          )}
        </Box>
      </Toolbar>
      <Toolbar
        sx={{
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          minHeight: 36,
          bgcolor: '#2F4F4F',
          px: 1,
          pb: { xs: 2, md: 0 },
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
  const [language, setLanguage] = React.useState('en');
  const [avatar, setAvatar] = React.useState<string | null>(null);

  React.useEffect(() => {
    document.title = language === 'pt' ? 'Sem Pressão' : 'No Pressure';
  }, [language]);

  // Fetch avatar from userInfo in session storage (set by Home/Patient)
  React.useEffect(() => {
    async function getAvatar() {
      try {
        // If you use Amplify Auth, replace this with your session fetch logic
        // const session = await fetchAuthSession();
        // const payload = session.tokens?.idToken?.payload;
        // Custom: avatar is stored in localStorage by Patient component after update
        const localAvatar = localStorage.getItem('avatar');
        if (localAvatar) {
          setAvatar(localAvatar);
        } else {
          setAvatar(null);
        }
      } catch {
        setAvatar(null);
      }
    }
    getAvatar();
    window.addEventListener('storage', getAvatar);
    return () => window.removeEventListener('storage', getAvatar);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <BrowserRouter>
          <Box sx={{ 
            bgcolor: '#d7e9f7', 
            minHeight: '100vh',
            width: '100vw',
            maxWidth: '100vw',
            overflowX: 'hidden',
            position: 'relative'
          }}>
            <CssBaseline />
            <NavigationBar language={language} setLanguage={setLanguage} avatar={avatar} />
            {/* Main app content goes here, e.g. routes */}
            <Home />
          </Box>
        </BrowserRouter>
      </LanguageContext.Provider>
    </ThemeProvider>
  );
}

export default App;
