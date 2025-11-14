
import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../../LanguageContext";
import bloodPressureImg from "../../assets/images/illustrations/blood-pressure-test.png";

interface BloodPressureReadingProps {
  userInfo: {
    userId: string | null;
    email: string | null;
    groups: string[];
  } | null;
}

const BloodPressureReading = ({ userInfo }: BloodPressureReadingProps) => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2, color: '#2F4F4F' }}>
        {language === 'pt' ? 'Leitura da Pressão Arterial' : 'Blood Pressure Reading'}
      </Typography>
      <img
        src={bloodPressureImg}
        alt="Blood Pressure Test"
        style={{ maxWidth: 320, width: '100%', height: 'auto', marginTop: 24, marginBottom: 24 }}
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2, width: '100%', maxWidth: 400 }}>
        <button
          style={{
            padding: '12px 8px',
            width: '100%',
            background: '#BE550F',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/patient/input-reading')}
        >
          {language === 'pt' ? 'Inserir Leitura' : 'Input Reading'}
        </button>
        <button
          style={{
            padding: '12px 8px',
            width: '100%',
            background: '#BE550F',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/patient/how-to-get-a-reading')}
        >
          {language === 'pt' ? 'Como Obter uma Leitura' : 'How to Get a Reading'}
        </button>
        <button
          style={{
            padding: '12px 8px',
            width: '100%',
            background: '#BE550F',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/patient/when-to-call-112')}
        >
          {language === 'pt' ? 'Quando Ligar 112' : 'When to call 112'}
        </button>
        <button
          style={{
            padding: '12px 8px',
            width: '100%',
            background: '#BE550F',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/patient/blood-pressure-history')}
        >
          {language === 'pt' ? 'Ver Meu Histórico de Pressão' : 'Show My Blood Pressure History'}
        </button>
      </Box>
    </Box>
  );
};

export default BloodPressureReading;
