import { Box, Typography, Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../../LanguageContext";
import bpMeasurementImage from "../../assets/images/illustrations/bp-measurement.png";
import bpMeasurementPtImage from "../../assets/images/illustrations/bp-measure-pt.png";

const HowToGetAReading = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#2F4F4F' }}>
        {language === 'pt' ? 'Como Obter uma Leitura' : 'How to Get a Reading'}
      </Typography>
      
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <img 
          src={language === 'pt' ? bpMeasurementPtImage : bpMeasurementImage}
          alt={language === 'pt' ? 'Como medir pressão arterial' : 'How to measure blood pressure'}
          style={{ 
            maxWidth: '100%', 
            width: '400px', 
            height: 'auto',
            borderRadius: '8px'
          }}
        />
      </Box>
      
      <Typography variant="body1" sx={{ maxWidth: 500, textAlign: 'center', mb: 3 }}>
        {language === 'pt'
          ? 'Para obter uma leitura precisa da pressão arterial, sente-se e relaxe por alguns minutos. Coloque a braçadeira no braço, mantenha o braço na altura do coração e siga as instruções do seu aparelho de pressão. Anote os valores de sistólica e diastólica.'
          : 'To get an accurate blood pressure reading, sit and relax for a few minutes. Place the cuff on your arm, keep your arm at heart level, and follow your device instructions. Record both the systolic and diastolic values.'}
      </Typography>
      
      <Button 
        variant="contained" 
        size="large"
        onClick={() => navigate('/patient/input-reading')}
        sx={{ 
          bgcolor: '#BE550F',
          color: '#FFFFFF',
          '&:hover': {
            bgcolor: '#9A4409'
          }
        }}
      >
        {language === 'pt' ? 'Inserir Leitura' : 'Input Reading'}
      </Button>
    </Box>
  );
};

export default HowToGetAReading;
