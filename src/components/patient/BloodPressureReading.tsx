
import { Box, Typography } from "@mui/material";
import './BloodPressureReading.css';
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../../LanguageContext";
import bloodPressureImg from "../../assets/images/illustrations/blood-pressure-test.png";

const BloodPressureReading = () => {
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, width: '100%', maxWidth: 320 }}>
        <button
          className="input-reading-btn"
          onClick={() => navigate('/patient/input-reading')}
        >
          {language === 'pt' ? 'Inserir Leitura' : 'Input Reading'}
        </button>
        <button
          className="how-to-reading-btn"
          onClick={() => navigate('/patient/how-to-get-a-reading')}
        >
          {language === 'pt' ? 'Como Obter uma Leitura' : 'How to Get a Reading'}
        </button>
      </Box>
    </Box>
  );
};

export default BloodPressureReading;
