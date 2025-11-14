import { useContext } from "react";
import LanguageContext from "../../LanguageContext";
import medicalImg from "../../assets/images/illustrations/med-symbol.png";

interface MedicoProps {
  userInfo: {
    userId: string | null;
    email: string | null;
    groups: string[];
  } | null;
}

const Medico = ({ userInfo }: MedicoProps) => {
  const { language } = useContext(LanguageContext);
  
  console.log("Medico component loaded for user:", {
    userId: userInfo?.userId,
    email: userInfo?.email
  });

  return (
    <div style={{padding: '2rem', textAlign: 'center'}}>
      <h2>{language === 'pt' ? 'Recursos Disponíveis em Breve' : 'Resources Coming Soon'}</h2>
      <img
        src={medicalImg}
        alt="Medical Professionals"
        style={{ maxWidth: 320, width: '100%', height: 'auto', marginTop: 24 }}
      />
    </div>
  );
};

export default Medico;
