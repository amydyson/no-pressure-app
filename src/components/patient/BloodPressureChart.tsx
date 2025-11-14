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

  // Position dot based on the specified ranges
  const xPercent = 15 + ((diastolic - 40) / 60) * 70; // 40-100 diastolic
  const yPercent = 85 - ((systolic - 70) / 120) * 70; // 70-190 systolic

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
          {/* Low - Blue (70-90 systolic, 40-60 diastolic) */}
          <rect x="15%" y="73.3%" width="23.3%" height="11.7%" fill="#0D47A1" opacity="0.6" />
          
          {/* Ideal - Green (90-120 systolic, 60-80 diastolic) - L-shape around blue */}
          <rect x="15%" y="56.7%" width="46.7%" height="16.6%" fill="#00C853" opacity="0.6" />
          <rect x="38.3%" y="73.3%" width="23.3%" height="11.7%" fill="#00C853" opacity="0.6" />
          
          {/* Pre-high - Yellow (120-140 systolic, 80-90 diastolic) */}
          <rect x="15%" y="43.3%" width="58.3%" height="13.4%" fill="#FFEB3B" opacity="0.4" />
          <rect x="61.7%" y="56.7%" width="11.7%" height="28.3%" fill="#FFEB3B" opacity="0.4" />
          
          {/* High - Red (140-190 systolic, 90-100 diastolic) */}
          <rect x="15%" y="15%" width="70%" height="28.3%" fill="#F44336" opacity="0.4" />
          <rect x="73.3%" y="43.3%" width="11.7%" height="41.7%" fill="#F44336" opacity="0.4" />
          
          {/* Grid lines */}
          {[50, 60, 70, 80, 90, 100].map(val => {
            const x = 15 + ((val - 40) / 60) * 70;
            return <line key={val} x1={`${x}%`} y1="15%" x2={`${x}%`} y2="85%" stroke="#ccc" strokeWidth="1" />;
          })}
          {[80, 90, 100, 120, 140, 160, 180, 190].map(val => {
            const y = 85 - ((val - 70) / 120) * 70;
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
          {[40, 50, 60, 70, 80, 90, 100].map(val => {
            const x = 15 + ((val - 40) / 60) * 70;
            return <text key={val} x={`${x}%`} y="90%" textAnchor="middle" fontSize="12" fill="#333">{val}</text>;
          })}
          
          {/* Systolic scale */}
          {[70, 80, 90, 100, 120, 140, 160, 180, 190].map(val => {
            const y = 85 - ((val - 70) / 120) * 70;
            return <text key={val} x="12%" y={`${y + 1}%`} textAnchor="end" fontSize="12" fill="#333">{val}</text>;
          })}
          
          {/* Zone labels */}
          <text x="26.65%" y="79.15%" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0D47A1">
            {language === 'pt' ? 'BAIXA' : 'LOW'}
          </text>
          
          <text x="50%" y="64%" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#00C853">
            {language === 'pt' ? 'PRESSÃO IDEAL' : 'IDEAL BLOOD'}
          </text>
          <text x="50%" y="67%" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#00C853">
            {language === 'pt' ? '' : 'PRESSURE'}
          </text>
          
          <text x="55%" y="49%" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#F57F17">
            {language === 'pt' ? 'PRÉ-ALTA' : 'PRE-HIGH'}
          </text>
          <text x="55%" y="52%" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#F57F17">
            {language === 'pt' ? 'PRESSÃO' : 'BLOOD PRESSURE'}
          </text>
          
          <text x="50%" y="28%" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#C62828">
            {language === 'pt' ? 'ALTA PRESSÃO' : 'HIGH BLOOD'}
          </text>
          <text x="50%" y="31%" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#C62828">
            {language === 'pt' ? '' : 'PRESSURE'}
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