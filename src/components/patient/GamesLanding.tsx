import { Box, Typography, Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../../LanguageContext";

const GamesLanding = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2, color: '#2F4F4F', textAlign: 'center' }}>
        {language === 'pt' ? 'Jogos Educativos' : 'Educational Games'}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: 600, color: '#666' }}>
        {language === 'pt' 
          ? 'Aprenda sobre pressão arterial de forma divertida com nossos jogos educativos!'
          : 'Learn about blood pressure in a fun way with our educational games!'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxWidth: 400 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/patient/game')}
          sx={{
            bgcolor: '#BE550F',
            '&:hover': { bgcolor: '#9A4409' },
            fontWeight: 'bold',
            py: 2,
            fontSize: '1.1rem'
          }}
        >
          {language === 'pt' ? 'Questionário' : 'Quiz'}
        </Button>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/patient/memory-game')}
          sx={{
            bgcolor: '#BE550F',
            '&:hover': { bgcolor: '#9A4409' },
            fontWeight: 'bold',
            py: 2,
            fontSize: '1.1rem'
          }}
        >
          {language === 'pt' ? 'Jogo da Memória' : 'Card Memory Game'}
        </Button>
      </Box>
    </Box>
  );
};

export default GamesLanding;