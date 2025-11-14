import { Box, Typography, Card, CardContent, Alert } from "@mui/material";
import { useContext } from "react";
import LanguageContext from "../../LanguageContext";

const WhenToCall112 = () => {
  const { language } = useContext(LanguageContext);

  const emergencySignsEn = [
    "Systolic pressure ≥ 180 mmHg or Diastolic pressure ≥ 120 mmHg",
    "Severe headache with high blood pressure",
    "Chest pain or difficulty breathing",
    "Severe dizziness or fainting",
    "Sudden vision problems",
    "Weakness or numbness in face, arm, or leg",
    "Difficulty speaking or understanding speech",
    "Severe nausea or vomiting with high blood pressure"
  ];

  const emergencySignsPt = [
    "Pressão sistólica ≥ 180 mmHg ou Pressão diastólica ≥ 120 mmHg",
    "Dor de cabeça severa com pressão alta",
    "Dor no peito ou dificuldade para respirar",
    "Tontura severa ou desmaio",
    "Problemas súbitos de visão",
    "Fraqueza ou dormência no rosto, braço ou perna",
    "Dificuldade para falar ou entender a fala",
    "Náusea ou vômito severo com pressão alta"
  ];

  const emergencySigns = language === 'pt' ? emergencySignsPt : emergencySignsEn;

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#2F4F4F', textAlign: 'center' }}>
        {language === 'pt' ? 'Quando Ligar 112' : 'When to Call 112'}
      </Typography>

      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {language === 'pt' ? '🚨 EMERGÊNCIA MÉDICA' : '🚨 MEDICAL EMERGENCY'}
        </Typography>
        <Typography variant="body2">
          {language === 'pt' 
            ? 'Ligue 112 imediatamente se você ou alguém apresentar qualquer um dos sinais abaixo:'
            : 'Call 112 immediately if you or someone experiences any of the signs below:'}
        </Typography>
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#BE550F' }}>
            {language === 'pt' ? 'Sinais de Emergência:' : 'Emergency Signs:'}
          </Typography>
          
          {emergencySigns.map((sign, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="body2" sx={{ mr: 1, color: '#d32f2f', fontWeight: 'bold' }}>
                •
              </Typography>
              <Typography variant="body2" sx={{ color: '#333' }}>
                {sign}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#BE550F' }}>
            {language === 'pt' ? 'Lembre-se:' : 'Remember:'}
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2, color: '#333' }}>
            {language === 'pt'
              ? '• 112 é o número de emergência europeu gratuito'
              : '• 112 is the free European emergency number'}
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2, color: '#333' }}>
            {language === 'pt'
              ? '• Funciona em todos os países da União Europeia'
              : '• Works in all European Union countries'}
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#333' }}>
            {language === 'pt'
              ? '• Pode ser chamado de qualquer telefone, mesmo sem crédito'
              : '• Can be called from any phone, even without credit'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WhenToCall112;