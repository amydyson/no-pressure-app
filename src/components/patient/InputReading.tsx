import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../../LanguageContext";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

interface InputReadingProps {
  userInfo: {
    userId: string | null;
    email: string | null;
    groups: string[];
  } | null;
}

const InputReading = ({ userInfo }: InputReadingProps) => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [showSuccessView, setShowSuccessView] = useState(false);
  // Success view after submission
  if (showSuccessView) {
    return (
      <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3, color: '#2F4F4F', textAlign: 'center' }}>
          {language === 'pt' ? 'Leitura Salva com Sucesso!' : 'Reading Saved Successfully!'}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 340 }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => setShowSuccessView(false)}
            sx={{ 
              bgcolor: '#BE550F',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: '#9A4409'
              }
            }}
          >
            {language === 'pt' ? 'Inserir Outra Leitura' : 'Input Another Reading'}
          </Button>
          
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/patient/blood-pressure-history')}
            sx={{ 
              bgcolor: '#BE550F',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: '#9A4409'
              }
            }}
          >
            {language === 'pt' ? 'Ver Meu Histórico de Pressão' : 'Show My Blood Pressure History'}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2, color: '#2F4F4F' }}>
        {language === 'pt' ? 'Inserir Leitura da Pressão Arterial' : 'Input Blood Pressure Reading'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const systolic = parseInt(formData.get('systolic') as string);
        const diastolic = parseInt(formData.get('diastolic') as string);
        const readingDate = formData.get('readingDate') as string;
        
        try {
          await client.models.BloodPressureReading.create({
            userId: userInfo?.userId || undefined,
            systolic,
            diastolic,
            readingDate
          });
          
          setShowSuccessView(true);
          
          // Clear form
          (e.target as HTMLFormElement).reset();
        } catch (error) {
          console.error('Error saving reading:', error);
          alert(language === 'pt' ? 'Erro ao salvar leitura' : 'Error saving reading');
        }
      }}>
        <label style={{ fontWeight: 500, color: '#2F4F4F' }}>
          {language === 'pt' ? 'Data da Leitura:' : 'Reading Date:'}
          {language === 'pt' ? (
            <input 
              type="text" 
              name="readingDate" 
              placeholder="DD/MM/AAAA" 
              inputMode="numeric"
              maxLength={10}
              ref={dateInputRef}
              onChange={(e) => {
                const input = e.target;
                const caret = input.selectionStart || 0;
                let raw = input.value.replace(/[^0-9]/g, "");
                if (raw.length > 8) raw = raw.slice(0, 8);
                let formatted = raw;
                if (raw.length > 4) {
                  formatted = raw.slice(0,2) + "/" + raw.slice(2,4) + "/" + raw.slice(4);
                } else if (raw.length > 2) {
                  formatted = raw.slice(0,2) + "/" + raw.slice(2);
                }
                let nextCaret = caret;
                const inputType = (e.nativeEvent as InputEvent).inputType || '';
                if (input.value[caret-1] === '/' && inputType === 'deleteContentBackward') {
                  nextCaret = caret - 1;
                } else if (raw.length > 2 && caret === 3 && inputType !== 'deleteContentBackward') {
                  nextCaret = caret + 1;
                } else if (raw.length > 4 && caret === 6 && inputType !== 'deleteContentBackward') {
                  nextCaret = caret + 1;
                }
                input.value = formatted;
                setTimeout(() => {
                  if (dateInputRef.current && document.activeElement === dateInputRef.current) {
                    dateInputRef.current.setSelectionRange(nextCaret, nextCaret);
                  }
                }, 0);
              }}
              required 
              style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }} 
            />
          ) : (
            <input type="date" name="readingDate" required style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }} />
          )}
        </label>
        <label style={{ fontWeight: 500, color: '#2F4F4F' }}>
          {language === 'pt' ? 'Sistólica (mmHg):' : 'Systolic (mmHg):'}
          <input type="number" name="systolic" min="50" max="250" required style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }} />
        </label>
        <label style={{ fontWeight: 500, color: '#2F4F4F' }}>
          {language === 'pt' ? 'Diastólica (mmHg):' : 'Diastolic (mmHg):'}
          <input type="number" name="diastolic" min="30" max="150" required style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: '1rem' }} />
        </label>
        <button type="submit" style={{
          padding: '12px 0',
          width: '100%',
          background: '#BE550F',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontSize: '1.1rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: 12
        }}>
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
