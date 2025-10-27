import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import './InputReading.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext } from "react";
import LanguageContext from "../../LanguageContext";

const InputReading = () => {
  const { language } = useContext(LanguageContext);
  return (
    <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2, color: '#2F4F4F' }}>
        {language === 'pt' ? 'Inserir Leitura da Pressão Arterial' : 'Input Blood Pressure Reading'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={e => { e.preventDefault(); alert(language === 'pt' ? 'Leitura enviada!' : 'Reading submitted!'); }}>
        <label style={{ fontWeight: 500, color: '#2F4F4F' }}>
          {language === 'pt' ? 'Sistólica (mmHg):' : 'Systolic (mmHg):'}
          <input type="number" name="systolic" min="50" max="250" required style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 500, color: '#2F4F4F' }}>
          {language === 'pt' ? 'Diastólica (mmHg):' : 'Diastolic (mmHg):'}
          <input type="number" name="diastolic" min="30" max="150" required style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }} />
        </label>
        <button type="submit" className="submit-reading-btn">
          {language === 'pt' ? 'Enviar Leitura' : 'Submit Reading'}
        </button>
      </Box>
      <Accordion sx={{ mt: 4, width: '100%', maxWidth: 340 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>{language === 'pt' ? 'Informações sobre esses números' : 'Information about these numbers'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {language === 'pt' ? 'Sistólica (o número maior)' : 'Systolic (the larger number)'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {language === 'pt'
              ? 'A pressão sistólica é o número superior (maior) em uma leitura de pressão arterial. Mede a pressão nas suas artérias quando o coração bate.'
              : 'Systolic pressure is the top (larger) number in a blood pressure reading. It measures the pressure in your arteries when your heart beats.'}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {language === 'pt' ? 'Diastólica (o número menor)' : 'Diastolic (the smaller number)'}
          </Typography>
          <Typography variant="body2">
            {language === 'pt'
              ? 'A pressão diastólica é o número inferior (menor). Mede a pressão nas suas artérias quando o coração descansa entre as batidas.'
              : 'Diastolic pressure is the bottom (smaller) number. It measures the pressure in your arteries when your heart rests between beats.'}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default InputReading;
