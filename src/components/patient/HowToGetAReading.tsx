import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import LanguageContext from "../../LanguageContext";

const HowToGetAReading = () => {
  const { language } = useContext(LanguageContext);
  return (
    <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2, color: '#2F4F4F' }}>
        {language === 'pt' ? 'Como Obter uma Leitura' : 'How to Get a Reading'}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 500 }}>
        {language === 'pt'
          ? 'Para obter uma leitura precisa da pressão arterial, sente-se e relaxe por alguns minutos. Coloque a braçadeira no braço, mantenha o braço na altura do coração e siga as instruções do seu aparelho de pressão. Anote os valores de sistólica e diastólica.'
          : 'To get an accurate blood pressure reading, sit and relax for a few minutes. Place the cuff on your arm, keep your arm at heart level, and follow your device instructions. Record both the systolic and diastolic values.'}
      </Typography>
    </Box>
  );
};

export default HowToGetAReading;
