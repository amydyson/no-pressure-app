import { Box } from "@mui/material";
import { useContext } from "react";
import LanguageContext from "../../LanguageContext";

interface BloodPressureChartProps {
  systolic: number;
  diastolic: number;
  width?: number;
  height?: number;
}

const BloodPressureChart = ({ systolic, diastolic, width = 500, height = 400 }: BloodPressureChartProps) => {
  const { language } = useContext(LanguageContext);

  // Position dot based on standard BP chart ranges
  const xPercent = 15 + ((diastolic - 40) / 120) * 70; // 40-160 diastolic
  const yPercent = 85 - ((systolic - 80) / 140) * 70; // 80-220 systolic

  return (
    <Box sx={{ position: 'relative', width: width, margin: '0 auto' }}>
      {/* Emergency warning */}
      {(systolic >= 180 || diastolic >= 120) && (
        <Box sx={{ 
          backgroundColor: '#FF0000', 
          color: '#FFFFFF', 
          padding: '12px', 
          borderRadius: '8px', 
          textAlign: 'center', 
          marginBottom: '16px',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          {language === 'pt' 
            ? '⚠️ EMERGÊNCIA: Ligue 112 imediatamente!' 
            : '⚠️ EMERGENCY: Call 112 immediately!'}
        </Box>
      )}
      
      {/* Doctor consultation warning */}
      {(systolic >= 140 || diastolic >= 90) && (systolic < 180 && diastolic < 120) && (
        <Box sx={{ 
          backgroundColor: '#FFC107', 
          color: '#000000', 
          padding: '12px', 
          borderRadius: '8px', 
          textAlign: 'center', 
          marginBottom: '16px',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          {language === 'pt' 
            ? '⚠️ ATENÇÃO: Consulte um médico' 
            : '⚠️ WARNING: Consult a doctor'}
        </Box>
      )}
      
      {/* Reading values display */}
      <Box sx={{ 
        textAlign: 'center', 
        marginBottom: '16px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333'
      }}>
        {language === 'pt' ? 'Sua leitura: ' : 'Your reading: '}{systolic}/{diastolic} mmHg
      </Box>
      
      <Box sx={{ width: width, height: height }}>
      <svg width={width} height={height} style={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd' }}>
        {/* Background zones */}
        <rect x="15%" y="15%" width="70%" height="20%" fill="#F44336" opacity="0.3" />
        <rect x="15%" y="35%" width="70%" height="15%" fill="#FF9800" opacity="0.3" />
        <rect x="15%" y="50%" width="70%" height="15%" fill="#FFEB3B" opacity="0.3" />
        <rect x="15%" y="65%" width="70%" height="20%" fill="#4CAF50" opacity="0.3" />
        
        {/* Major grid lines */}
        {[50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150].map(val => {
          const x = 15 + ((val - 40) / 120) * 70;
          return <line key={val} x1={`${x}%`} y1="15%" x2={`${x}%`} y2="85%" stroke="#ccc" strokeWidth="1" />;
        })}
        {[90, 100, 120, 140, 160, 180, 200, 220].map(val => {
          const y = 85 - ((val - 80) / 140) * 70;
          return <line key={val} x1="15%" y1={`${y}%`} x2="85%" y2={`${y}%`} stroke="#ccc" strokeWidth="1" />;
        })}
        
        {/* Axes */}
        <line x1="15%" y1="85%" x2="85%" y2="85%" stroke="#000" strokeWidth="2" />
        <line x1="15%" y1="15%" x2="15%" y2="85%" stroke="#000" strokeWidth="2" />
        
        {/* Axis labels */}
        <text x="50%" y="95%" textAnchor="middle" fontSize="14" fill="#000" fontWeight="bold">
          {language === 'pt' ? 'Pressão Diastólica (mmHg)' : 'Diastolic Pressure (mmHg)'}
        </text>
        <text x="4%" y="50%" textAnchor="middle" fontSize="14" fill="#000" fontWeight="bold" transform={`rotate(-90, ${width * 0.04}, ${height * 0.5})`}>
          {language === 'pt' ? 'Pressão Sistólica (mmHg)' : 'Systolic Pressure (mmHg)'}
        </text>
        
        {/* Diastolic scale */}
        {[40, 60, 80, 100, 120, 140, 160].map(val => {
          const x = 15 + ((val - 40) / 120) * 70;
          return <text key={val} x={`${x}%`} y="90%" textAnchor="middle" fontSize="12" fill="#333">{val}</text>;
        })}
        
        {/* Systolic scale */}
        {[80, 100, 120, 140, 160, 180, 200, 220].map(val => {
          const y = 85 - ((val - 80) / 140) * 70;
          return <text key={val} x="12%" y={`${y + 1}%`} textAnchor="end" fontSize="12" fill="#333">{val}</text>;
        })}
        
        {/* Zone labels */}
        <text x="50%" y="25%" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#C62828">
          {language === 'pt' ? 'ALTA ESTÁGIO 2' : 'HIGH STAGE 2'}
        </text>
        <text x="50%" y="42%" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#E65100">
          {language === 'pt' ? 'ALTA ESTÁGIO 1' : 'HIGH STAGE 1'}
        </text>
        <text x="50%" y="57%" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#F57F17">
          {language === 'pt' ? 'ELEVADA' : 'ELEVATED'}
        </text>
        <text x="50%" y="75%" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#2E7D32">
          {language === 'pt' ? 'NORMAL' : 'NORMAL'}
        </text>
        
        {/* Reading marker - red X */}
        <g transform={`translate(${width * xPercent / 100}, ${height * yPercent / 100})`}>
          <line x1="-8" y1="-8" x2="8" y2="8" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" />
          <line x1="8" y1="-8" x2="-8" y2="8" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" />
        </g>
        

      </svg>
      </Box>
    </Box>
  );
};

export default BloodPressureChart;